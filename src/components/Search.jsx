import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());

        // console.log(doc.data()); //-> thông tin của user được search
      });
    } catch (err) {
      setErr(true);
    }
  };

  // Handle Enter to search:
  const handleKey = (e) => {
    e.code === ("Enter" || "NumpadEnter") && handleSearch();
  };

  // Handle Click Search:
  const handleSelect = async () => {
    // check whether the group(chats in firestore) exists, if not create new one:
    // đoạn này không hiểu ">" là như nào
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // create a chat in chats collection:
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // create user chats:
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),

          /* [combinedId + ".userInfo"]: {};
          ==> cách viết trên tương tự với:

            combinedId: {
              userInfo: {
                uid,
                displayName,
                photoURL
              }
            }

            ==> Hay!
            */
        });

        // Hàm update này dữ liệu sẽ được append vào bên dưới dữ liệu cũ, chứ không phải đè lên dữ liệu cũ!!
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }

    dispatch({ type: "CHANGE_USER", payload: user });

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find an user"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div onClick={handleSelect} className="userChat">
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

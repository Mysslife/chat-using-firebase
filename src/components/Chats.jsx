import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  console.log(chats);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      // Lắng nghe sự kiện realtime thì phải clean-up function:
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser]);

  // HANDLE SELECT CHAT USER:
  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              onClick={() => handleSelect(chat[1].userInfo)}
              key={chat[0]}
              className="userChat"
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Chats;

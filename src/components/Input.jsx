import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useContext, useState } from "react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState("");

  const currentUser = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  // console.log(data.chatId);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (err) {
            console.log(err);
          }
        });
      });

      // const uploadTask = uploadBytesResumable(storageRef, img);
      // uploadTask.on(
      //   (error) => {},
      //   () => {
      //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      //       // update append nội dung tin nhắn mới vào trong document chatId giữa 2 tài khoản: currentUser và user được chọn!!!!
      //       // update append nội dung mới vào trong một mảng trong firebase thì phải dùng hàm arrayUnion();
      //       await updateDoc(doc(db, "chats", data.chatId), {
      //         messages: arrayUnion({
      //           id: uuid(),
      //           text,
      //           senderId: currentUser.uid,
      //           date: Timestamp.now(),
      //           img: downloadURL,
      //         }),
      //       });
      //     });
      //   }
      // );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg("");
  };

  // HANDLE KEY DOWN ENTER TO SEND MESSAGE:
  const handleKey = (e) => {
    if (e.code === ("Enter" || "NumpadEnter")) {
      handleSend();
      setText("");
      setImg("");
    }
  };

  return (
    <div className="input">
      <input
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="Type something ...."
        value={text}
        onKeyDown={handleKey}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
          style={{ display: "none" }}
          id="file"
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;

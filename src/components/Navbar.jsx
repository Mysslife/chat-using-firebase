import { signOut } from "firebase/auth";
import { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const currentUser = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Mysllife Chat</span>
      <div className="user">
        <img
          src={
            currentUser.photoURL ||
            "https://images.pexels.com/photos/2180287/pexels-photo-2180287.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          }
          alt=""
        />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPmEQbBtZVChrtRYij7sL3UJeFQ0WXPLk",
  authDomain: "chat-f488c.firebaseapp.com",
  projectId: "chat-f488c",
  storageBucket: "chat-f488c.appspot.com",
  messagingSenderId: "220588140096",
  appId: "1:220588140096:web:77b284ed6f1d651cf061a5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); // -> thằng này luôn phải đứng trên cùng!!!!
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

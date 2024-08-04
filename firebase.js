import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6EUOWe0VAukTg-s3RY0O2j49qFNqh9GM",
  authDomain: "inventory-management-671a6.firebaseapp.com",
  projectId: "inventory-management-671a6",
  storageBucket: "inventory-management-671a6.appspot.com",
  messagingSenderId: "587403708849",
  appId: "1:587403708849:web:cd8c4300453a0fff889590",
  measurementId: "G-HTQ33CB4E3",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app, "gs://inventory-management-671a6.appspot.com");
export default firestore;
export { app, auth, storage };

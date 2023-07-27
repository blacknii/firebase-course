import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDILwakZziWbFAnx6lq9gzIhFwYYd_O40U",
  authDomain: "fir-course-3bc59.firebaseapp.com",
  projectId: "fir-course-3bc59",
  storageBucket: "fir-course-3bc59.appspot.com",
  messagingSenderId: "516010320593",
  appId: "1:516010320593:web:8075e88b76469b0bfadbf0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

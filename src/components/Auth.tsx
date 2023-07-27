import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { ChangeEvent, useState } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(auth.currentUser?.photoURL);

  const singIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const singInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <input value={email} onChange={handleEmail} placeholder="Email..." />
      <input
        value={password}
        onChange={handlePassword}
        type="password"
        placeholder="Password..."
      />
      <button onClick={singIn}>Sign In</button>

      <button onClick={singInWithGoogle}>Sign In With Google</button>

      <button onClick={logout}>Logout</button>
    </>
  );
};

import { auth, githubProvider, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export const signUpfn = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    throw error;
  }
};

export const signInfn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error during sign In:", error.message);
    throw error;
  }
};

export const googleSignInFn = async () => {
  try {
    const googleSignIn = await signInWithPopup(auth, googleProvider);
    console.log("GOOGLE");

    return googleSignIn;
  } catch (error) {
    console.error("Error during sign In with GOOGLE:", error.message);
  }
};

export const githubSignInFn = async () => {
  try {
    const githubSignIn = await signInWithPopup(auth, githubProvider);
    console.log("GITHUB");

    return githubSignIn;
  } catch (error) {
    console.error("Error during sign In with GITHUB:", error.message);
  }
};

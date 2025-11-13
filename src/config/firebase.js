import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGEyL4AkJ0B9T5UEma8MEjJTazOKW_jNE",
  authDomain: "lrf-project-2a0bb.firebaseapp.com",
  projectId: "lrf-project-2a0bb",
  storageBucket: "lrf-project-2a0bb.firebasestorage.app",
  messagingSenderId: "164810574097",
  appId: "1:164810574097:web:ef2a93c3c29744c8c1a4b0",
  measurementId: "G-BBSCWLT54Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

//

export const db = getFirestore(app);

//

export const storage = getStorage(app);

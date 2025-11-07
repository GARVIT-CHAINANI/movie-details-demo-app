import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, githubProvider, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export const signUpfn = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      provider: "email",
      createdAt: new Date(),
    });

    console.log("✅ User document created in Firestore");
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
    console.error("Error during sign in:", error.message);
    throw error;
  }
};

export const googleSignInFn = async () => {
  try {
    const googleSignIn = await signInWithPopup(auth, googleProvider);
    const user = googleSignIn.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        provider: "google",
        createdAt: new Date(),
      });
      console.log("🆕 Firestore doc created for Google user");
    } else {
      console.log("✅ Google user already exists in Firestore");
    }

    return googleSignIn;
  } catch (error) {
    console.error("Error during sign in with GOOGLE:", error.message);
    throw error;
  }
};

export const githubSignInFn = async () => {
  try {
    const githubSignIn = await signInWithPopup(auth, githubProvider);
    const user = githubSignIn.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        provider: "github",
        createdAt: new Date(),
      });
      console.log("🆕 Firestore doc created for GitHub user");
    } else {
      console.log("✅ GitHub user already exists in Firestore");
    }

    return githubSignIn;
  } catch (error) {
    console.error("Error during sign in with GITHUB:", error.message);
    throw error;
  }
};

export const forgetPasswordFn = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "https://firebase-demo-project.netlify.app/auth?mode=login",
    });
    alert("Password reset email sent! Please check your inbox or spam folder.");
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    alert(error.message);
  }
};

//

export const updateProfileName = async (newName) => {
  try {
    // 1️⃣ Update in Firestore
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      displayName: newName,
    });

    // 2️⃣ Update in Firebase Auth
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: newName,
      });
    }

    console.log("✅ Display name updated in both Firestore & Auth");
  } catch (error) {
    console.error("❌ Error updating name:", error.message);
  }
};

export const getUserFromFirestore = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn("❌ No user found in Firestore for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching user from Firestore:", error.message);
    return null;
  }
};

export const deleteUserFromFirestore = async (password = null) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    // Reauthenticate based on provider
    const provider = user.providerData[0].providerId;

    if (provider === "password") {
      if (!password) throw new Error("Password required to delete this user.");
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    } else if (provider === "google.com") {
      await reauthenticateWithPopup(user, new GoogleAuthProvider());
    } else if (provider === "github.com") {
      await reauthenticateWithPopup(user, new GithubAuthProvider());
    }

    // Delete Firestore document
    const userRef = doc(db, "users", user.uid);
    await deleteDoc(userRef);
    console.log("User document deleted from Firestore.");

    // Delete user from Auth
    await user.delete();
    console.log("User deleted from Firebase Authentication.");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

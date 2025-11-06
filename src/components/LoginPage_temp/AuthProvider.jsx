import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { Spin } from "antd";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 🔥 Force refresh user data before setting
        await user.reload();
        const updatedUser = auth.currentUser;

        setCurrentUser({ ...updatedUser });
        console.log("User logged in:", updatedUser.email);
        console.log("Display name:", updatedUser.displayName);
      } else {
        setCurrentUser(null);
        console.log("No one logged in");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

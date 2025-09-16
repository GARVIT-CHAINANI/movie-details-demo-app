import { useEffect, useRef, useState } from "react";
import "./login.css";

export default function LogIn() {
  const [isHaveAccount, setIsHaveAccount] = useState(true);
  const [errors, setErrors] = useState({}); // ✅ store errors per field
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (idRef.current) idRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    setErrors({}); // clear errors when switching
  }, [isHaveAccount]);

  function handleSignup() {
    setIsHaveAccount(!isHaveAccount);
  }

  async function createAccount(userId, password) {
    const newErrors = {};
    if (!userId) newErrors.userId = "User ID is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Signup failed" });
        return;
      }

      setErrors({ general: "Account created successfully " });
      idRef.current.value = "";
      passwordRef.current.value = "";
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  }

  async function fetchAccount(userId, password) {
    const newErrors = {};
    if (!userId) newErrors.userId = "User ID is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general: "We couldn’t verify your login details. Please try again.",
        });
        return;
      }

      setErrors({ general: "Login successful " });
      idRef.current.value = "";
      passwordRef.current.value = "";
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const userId = idRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (isHaveAccount) {
      fetchAccount(userId, password);
    } else {
      createAccount(userId, password);
    }
  }

  return (
    <div className="login_input-container">
      <h2>{isHaveAccount ? "USER LOGIN" : "SIGN-UP"}</h2>

      <form className="input-container" onSubmit={handleSubmit}>
        <div
          className="input-div id"
          style={errors.userId && { marginBottom: -10 }}
        >
          <input
            type="text"
            ref={idRef}
            placeholder={
              isHaveAccount ? "Enter your User ID" : "Set your User ID"
            }
          />
        </div>
        {errors.userId && <p className="error-text">{errors.userId}</p>}

        <div
          className="input-div password"
          style={
            errors.password
              ? { marginTop: -12, marginBottom: -10 }
              : errors.general
              ? { marginBottom: -12 }
              : {}
          }
        >
          <input
            type="password"
            ref={passwordRef}
            placeholder={
              isHaveAccount ? "Enter your Password" : "Set your Password"
            }
          />
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        {errors.general && (
          <p
            className={`form-message ${
              errors.general.includes("success") ? "success" : "error"
            }`}
          >
            {errors.general}
          </p>
        )}

        <button type="submit" style={errors.general && { marginTop: -10 }}>
          {isHaveAccount ? "Login" : "Confirm"}
        </button>

        <div className="change">
          <p>
            {isHaveAccount ? (
              <>
                Don&apos;t have an account?{" "}
                <span onClick={handleSignup}>Sign-up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={handleSignup}>Log-in</span>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

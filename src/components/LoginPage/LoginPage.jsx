import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import "./loginPage.css";
import logo from "../../assets/ChatGPT Image Sep 12, 2025, 01_08_10 PM.png";
import Login from "../LoginPage/logIn.jsx";
import { useAuth } from "../../utils/hooks/useAuth.js";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // 🧠 FIXED: useAuth must be *called* like a function

  const isLoginMode = searchParams.get("mode") === "login";

  // Ensure the query param is present; keeps behavior consistent
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (!mode) {
      navigate("?mode=login", { replace: true });
    }
  }, [searchParams, navigate]);

  // redirect logged-in users directly to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <>
      {currentUser && <h1>Already logged in</h1>}
      {!currentUser && (
        <div className="login-container">
          <div className="login-card">
            <div className="login_side-section">
              <div className="login-logo">
                <a href="https://github.com/GARVIT-CHAINANI/movie-details-demo-app">
                  <img src={logo} alt="logo" />
                </a>
              </div>

              <Login
                formTitle={isLoginMode ? "Log In" : "Sign Up"}
                userIdPlaceHolderMessage={"Enter your Email address"}
                passwordPlaceHolderMessage={
                  isLoginMode ? "Enter your Password" : "Set your Password"
                }
                submitButtonText={isLoginMode ? "Login" : "Register"}
                isLoginMode={isLoginMode}
              />

              <div className="login-footer">
                <p>
                  This login page was built by{" "}
                  <span>
                    <a href="https://github.com/GARVIT-CHAINANI">
                      Garvit Chainani
                    </a>
                  </span>{" "}
                  using React.js
                </p>
              </div>
            </div>

            <div className="login_middle-section">
              <div className="content">
                <h1>Welcome to website</h1>
                <p>
                  This Login/signup page perform Registeration of user and
                  Logging in of user with Firebase, made by Garvit for learning
                  purpose. Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s... Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="layer"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

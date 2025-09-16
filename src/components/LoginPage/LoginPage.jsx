import "./loginPage.css";
import logo from "../../assets/ChatGPT Image Sep 12, 2025, 01_08_10 PM.png";
import LogIn from "./LogIn";

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login_side-section">
          <div className="login-logo">
            <a href="https://github.com/GARVIT-CHAINANI/movie-details-demo-app">
              <img src={logo} alt="" />
            </a>
          </div>
          <LogIn />
          <div className="login-footer">
            <p>
              This login page was built by{" "}
              <span>
                <a href="https://github.com/GARVIT-CHAINANI">
                  Garvit Chainani{" "}
                </a>
              </span>
              using React.js
            </p>
          </div>
        </div>
        <div className="login_middle-section">
          <div className="content">
            <h1>Welcome to website</h1>
            <p>
              This Movie Details app was developed as a demo project with the
              primary goal of learning React and exploring other modern tools.
              It allows users to fetch and view detailed information about any
              movie. While its purpose is educational, the app is fully
              functional and demonstrates how a complete movie search and
              details application can be built.
            </p>
          </div>
          <div className="layer"></div>
        </div>
      </div>
    </div>
  );
}

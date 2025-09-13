import "./login.css";

export default function LogIn() {
  return (
    <div className="login_input-container">
      <h2>USER LOGIN</h2>

      <div className="input-container">
        <div className="input-div id">
          <input type="text" />
        </div>

        <div className="input-div password">
          <input type="password" />
        </div>
        <button type="submit">Login</button>
        <div className="change">
          <p>
            Don't have an account? <span> Sign-up </span>
          </p>
        </div>
      </div>
    </div>
  );
}

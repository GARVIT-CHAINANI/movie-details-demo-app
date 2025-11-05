import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { Link } from "react-router-dom";
import "./forgotpassword.css"; // Typo fix in filename
import { useState } from "react";
import { forgetPasswordFn } from "../../utils/firebase";

const ForgotPasswordComp = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await forgetPasswordFn(forgotPasswordEmail);
    console.log(forgotPasswordEmail);

    setLoading(false);
  };

  return (
    <main className="forgot-password-main">
      <section className="forgot-password-section">
        <div className="forgot-password-top">
          <h2>Forgot Password?</h2>
          <p>No worries, we’ll send you reset instructions.</p>
        </div>

        <Divider />

        <div className="forgot-password-form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => {
                setForgotPasswordEmail(e.target.value);
              }}
              value={forgotPasswordEmail}
            />

            <Button
              htmlType="submit"
              className="forgot-password-submit"
              loading={loading}
              disabled={!forgotPasswordEmail.trim()}
            >
              Reset Password
            </Button>

            <Link to="../" className="back-to-login-link">
              <ArrowLeftOutlined /> Back to login
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordComp;

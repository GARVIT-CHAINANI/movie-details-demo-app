import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import {
  githubSignInFn,
  googleSignInFn,
  signInfn,
  signUpfn,
} from "../../utils/firebase";
import { updateProfile } from "firebase/auth"; // ❌ removed onAuthStateChanged (unused)
import { Button } from "antd";
import { GithubFilled, GoogleOutlined } from "@ant-design/icons";
import { auth } from "../../config/firebase";
import { useAuth } from "../../utils/hooks/useAuth";

const Login = ({
  formTitle,
  userIdPlaceHolderMessage,
  passwordPlaceHolderMessage,
  submitButtonText,
  isLoginMode,
}) => {
  const [enteredInput, setEnteredInput] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredInput({ ...enteredInput, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, firstName, lastName } = enteredInput;
    const validationErrors = {};

    // Email validation
    if (!email?.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password?.trim()) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    // Name validation for signup mode
    if (!isLoginMode) {
      if (!firstName?.trim()) {
        validationErrors.firstName = "First name is required";
      }
      if (!lastName?.trim()) {
        validationErrors.lastName = "Last name is required";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLoginMode) {
        await signInfn(email, password);
      } else {
        const userCredential = await signUpfn(email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`.trim(),
        });

        await user.reload();

        // ✅ Immediately sync context
        setCurrentUser(auth.currentUser);

        console.log("✅ Display name updated:", auth.currentUser.displayName);
      }

      // ✅ Navigate after success
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({
        submit: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThirdPartySignIn = async (signInFunction, provider) => {
    setIsLoading(true);
    setErrors({});

    try {
      await signInFunction();
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        submit: `${provider} sign-in failed. Please try again.`,
      });
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>{formTitle}</h2>

      {errors.submit && (
        <div className="error-message-banner">
          <p>{errors.submit}</p>
        </div>
      )}

      <div className="input-container">
        {!isLoginMode && (
          <div className="name-container">
            <div className="input-div">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={enteredInput.firstName}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="error-text">{errors.firstName}</p>
              )}
            </div>
            <div className="input-div">
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={enteredInput.lastName}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        <div className="input-div">
          <input
            type="text"
            name="email"
            placeholder={userIdPlaceHolderMessage}
            value={enteredInput.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="input-div">
          <input
            type="password"
            name="password"
            placeholder={passwordPlaceHolderMessage}
            value={enteredInput.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : submitButtonText}
        </button>
      </div>

      <div className="signin-third-party">
        <Button
          icon={<GoogleOutlined />}
          onClick={() => handleThirdPartySignIn(googleSignInFn, "Google")}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>
        <Button
          icon={<GithubFilled />}
          onClick={() => handleThirdPartySignIn(githubSignInFn, "Github")}
          disabled={isLoading}
        >
          Sign in with Github
        </Button>
      </div>

      <p className="switch-mode">
        {isLoginMode ? (
          <>
            Don’t have an account?{" "}
            <a
              href="?mode=signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("?mode=signup");
              }}
            >
              Sign Up
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a
              href="?mode=login"
              onClick={(e) => {
                e.preventDefault();
                navigate("?mode=login");
              }}
            >
              Log In
            </a>
          </>
        )}
      </p>
    </form>
  );
};

export default Login;

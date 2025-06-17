import styled from "styled-components";
import React from "react";
import { Navigate } from "react-router-dom";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../../services/auth/auth";
import { useAuth } from "../../../services/auth/AuthContext";
import { useState } from "react";
import SecondaryInput from "../Inputs/SecondaryInput";
import PrimaryButton from "../Buttons/PrimaryButton";
import googleIcon from "../../../assets/icons/google.svg";
import CloseIcon from "../../../assets/icons/close.svg?react";
import {
  VALIDATION_PATTERNS,
  VALIDATION_MESSAGES,
} from "../../../constants/validation";
import { VALIDATION_RULES } from "../../../constants/uploadLimits";

const LoginModal = ({ onClose, initialRegister = false, onRegistered }) => {
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError("");
    setError(null);
    if (newEmail.trim() && !VALIDATION_PATTERNS.EMAIL.test(newEmail)) {
      setEmailError(VALIDATION_MESSAGES.EMAIL_INVALID);
    }
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
    setError(null);
    if (
      isRegister &&
      newPassword.trim() &&
      newPassword.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH
    ) {
      setPasswordError(
        `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`
      );
    }
  };
  const validateLoginForm = () => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
      setEmailError(VALIDATION_MESSAGES.EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (
      isRegister &&
      password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH
    ) {
      setPasswordError(
        `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };
  const handleModeSwitch = () => {
    setIsRegister((r) => !r);
    setError(null);
    setEmailError("");
    setPasswordError("");
  };

  const handleAuth = async () => {
    setError(null);
    setLoading(true);
    if (!validateLoginForm()) {
      setLoading(false);
      return;
    }
    try {
      if (isRegister) {
        const userCredential = await registerWithEmailAndPassword(
          email,
          password
        );
        if (onRegistered) {
          onRegistered(userCredential.user.uid);
        }
        setLoading(false);
        return;
      } else {
        await loginWithEmailAndPassword(email, password);
        onClose();
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (err.code === "auth/invalid-email") {
        setEmailError("Invalid email address. Please check and try again.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("Email not found. Please register.");
      } else if (err.code === "auth/weak-password") {
        setPasswordError(
          "Password is too weak. Please use a stronger password."
        );
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;

      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      if (isNewUser && onRegistered) {
        onRegistered(user.uid);
        setLoading(false);
        return;
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google authentication failed");
    }
    setLoading(false);
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </CloseButton>
        <h1>{isRegister ? "Create an account" : "Sign in to your account"}</h1>
        <button
          className="google-container"
          type="button"
          onClick={handleGoogle}
          disabled={loading}
        >
          <img src={googleIcon} alt="Google" />
          <span>Continue with Google</span>
        </button>
        <p>
          {isRegister
            ? "-Or Register using your Email-"
            : "-Or Log In using your Email-"}
        </p>
        <SecondaryInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
          error={emailError}
        />
        <SecondaryInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          disabled={loading}
          error={passwordError}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="login-container">
          <PrimaryButton
            onClick={handleAuth}
            disabled={loading || !!emailError || !!passwordError}
          >
            {loading ? "Loading..." : isRegister ? "Register" : "Log in"}
          </PrimaryButton>
          <p>Or</p>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleModeSwitch();
            }}
            style={{ cursor: "pointer" }}
          >
            {isRegister ? "Log in" : "Sign up"}
          </a>
        </div>
      </ModalContainer>
    </Overlay>
  );
};

const ErrorMessage = styled.p`
  color: #ff4343;
  margin: 0;
  font-size: 14px;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #181818;
  width: 600px;
  height: 600px;
  gap: 20px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);

  h1 {
    font-size: 24px;
    color: #fff;
    margin-bottom: 20px;
  }

  p {
    color: #d9d9d9;
    font-size: 18px;
  }

  .google-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #d9d9d9;
    border: none;
    width: 512px;
    height: 44px;
    border-radius: 16px;
    cursor: pointer;
    img {
      width: 30px;
    }

    span {
      color: #3d3131;
      font-size: 16px;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input {
    height: 44px;
    cursor: text;
  }

  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    p {
      color: #fff;
      font-size: 16px;
    }

    a {
      color: #ff4343;
      font-size: 18px;
      text-decoration: none;
      cursor: pointer;
    }
    button {
      width: 134px;
      height: 44px;
      font-size: 20px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  svg {
    width: 32px;
    height: 32px;
  }

  svg path {
    stroke: #fff;
  }

  &:hover svg path {
    stroke: #ff4343;
  }
`;

export default LoginModal;

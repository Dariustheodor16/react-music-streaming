import styled from "styled-components";
import React from "react";
import { Navigate } from "react-router-dom";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../../services/auth";
import { useAuth } from "../../../services/authContext.jsx";
import { useState } from "react";
import SecondaryInput from "../../ui/Inputs/SecondaryInput";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import googleIcon from "../../../assets/icons/google.svg";
import CloseIcon from "../../../assets/icons/close.svg?react";

const LoginModal = ({ onClose, initialRegister = false, onRegistered }) => {
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError(null);
    setLoading(true);
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
        return; // Don't close modal here, let parent handle it
      } else {
        await loginWithEmailAndPassword(email, password);
        onClose();
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("Email not found. Please register.");
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
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message) || "Google authentication failed";
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
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <SecondaryInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && <p style={{ color: "#ff4343", margin: 0 }}>{error}</p>}
        <div className="login-container">
          <PrimaryButton onClick={handleAuth} disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Register" : "Log in"}
          </PrimaryButton>
          <p>Or</p>
          <a
            onClick={(e) => {
              e.preventDefault();
              setIsRegister((r) => !r);
              setError(null);
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

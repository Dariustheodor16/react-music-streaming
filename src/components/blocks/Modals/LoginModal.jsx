import styled from "styled-components";
import { useState } from "react";
import SecondaryInput from "../../ui/Inputs/SecondaryInput";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import googleIcon from "../../../assets/icons/google.svg";
import CloseIcon from "../../../assets/icons/close.svg?react";

const LoginModal = ({ onClose, initialRegister = false }) => {
  const [isRegister, setIsRegister] = useState(initialRegister);

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <h1>{isRegister ? "Create an account" : "Sign in to your account"}</h1>
        <button className="google-container" type="button">
          <img src={googleIcon} alt="Google" />
          <span>Continue with Google</span>
        </button>
        <p>
          {isRegister
            ? "-Or Register using your Email-"
            : "-Or Log In using your Email-"}
        </p>
        <SecondaryInput type="text" placeholder="Email" />
        <SecondaryInput type="password" placeholder="Password" />
        <div className="login-container">
          <PrimaryButton>{isRegister ? "Register" : "Log in"}</PrimaryButton>
          <p>Or</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsRegister((r) => !r);
            }}
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

    img {
      width: 30px;
    }

    span {
      color: #3d3131;
      font-size: 16px;
    }
  }

  input {
    height: 44px;
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
    stroke: white;
  }

  &:hover svg path {
    stroke: #ff4343;
  }
`;

export default LoginModal;

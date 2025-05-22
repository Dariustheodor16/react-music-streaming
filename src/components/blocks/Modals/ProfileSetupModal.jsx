import { useState } from "react";
import { firestore } from "../../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import SecondaryInput from "../../ui/Inputs/SecondaryInput";
import ImageFileInput from "../../ui/Inputs/ImageFileInput";

const ProfileSetupModal = () => {
  return (
    <Overlay>
      <ModalContainer>
        <h1>Profile Setup</h1>
        <SecondaryInput placeholder="Username"></SecondaryInput>
        <ImageFileInput />
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

export default ProfileSetupModal;

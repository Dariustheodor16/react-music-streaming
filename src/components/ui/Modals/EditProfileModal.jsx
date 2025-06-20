import { useState } from "react";
import styled from "styled-components";
import { doc } from "firebase/firestore";
import { firestore } from "../../../services/firebase";
import SecondaryInput from "../Inputs/SecondaryInput";
import PrimaryButton from "../Buttons/PrimaryButton";
import ImageFileInput from "../Inputs/ImageFileInput";
import CloseIcon from "../../../assets/icons/close.svg?react";
import { userService } from "../../../services/api/userService";
import { VALIDATION_MESSAGES } from "../../../constants/validation";

const EditProfileModal = ({ currentProfile, userId, onClose, onUpdate }) => {
  const [displayName, setDisplayName] = useState(
    currentProfile?.displayName || ""
  );
  const [photoURL, setPhotoURL] = useState(currentProfile?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

  const validateDisplayName = (displayName) => {
    return displayName && displayName.trim().length > 0;
  };

  const handleDisplayNameChange = (e) => {
    const newDisplayName = e.target.value;
    setDisplayName(newDisplayName);
    setDisplayNameError("");
    setError("");
    if (!newDisplayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
    }
  };

  const handleDisplayNameBlur = () => {
    if (!displayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!displayName.trim()) {
      setDisplayNameError(VALIDATION_MESSAGES.DISPLAY_NAME_REQUIRED);
      isValid = false;
    } else {
      setDisplayNameError("");
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updatedData = {
        displayName: displayName.trim(),
        photoURL: photoURL,
      };

      await userService.updateUserProfile(userId, updatedData);

      const updatedProfile = { ...currentProfile, ...updatedData };
      onUpdate(updatedProfile);
      onClose();
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Edit Profile</h2>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>

        <Content>
          <InputSection>
            <Label>Display Name</Label>
            <SecondaryInput
              placeholder="Enter your display name"
              value={displayName}
              onChange={handleDisplayNameChange}
              onBlur={handleDisplayNameBlur}
              disabled={saving}
              error={displayNameError}
            />
          </InputSection>

          <ImageSection>
            <Label>Profile Picture</Label>
            <ImageFileInput onUpload={setPhotoURL} initialImage={photoURL} />
          </ImageSection>
        </Content>

        <ButtonContainer>
          <SecondaryButton onClick={onClose} disabled={saving}>
            Cancel
          </SecondaryButton>
          <SaveChangesButton
            onClick={handleSave}
            disabled={saving || !displayName.trim() || !!displayNameError}
          >
            {saving ? "Saving..." : "Save Changes"}
          </SaveChangesButton>
        </ButtonContainer>

        {error && <ErrorText>{error}</ErrorText>}
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #333;

  h2 {
    color: #fff;
    margin: 0;
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    svg path {
      stroke: #ff4343;
    }
  }

  svg {
    width: 40px;
    height: 40px;
  }
`;

const Content = styled.div`
  padding: 32px;
`;

const InputSection = styled.div`
  margin-bottom: 32px;
`;

const ImageSection = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.label`
  display: block;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid #333;
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid #585858;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #ff4343;
    color: #ff4343;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveChangesButton = styled(PrimaryButton)`
  width: 240px !important;
  height: 54px !important;
  white-space: nowrap !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
`;

const ErrorText = styled.p`
  color: #ff4343;
  text-align: center;
  margin: 0;
  padding: 0 32px 24px;
  font-size: 14px;
`;

export default EditProfileModal;

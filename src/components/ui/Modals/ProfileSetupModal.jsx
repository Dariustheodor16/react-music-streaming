import { useProfileSetup } from "../../../hooks/profile-hooks/useProfileSetup";
import SecondaryInput from "../Inputs/SecondaryInput";
import ImageFileInput from "../Inputs/ImageFileInput";
import PrimaryButton from "../Buttons/PrimaryButton";
import styled from "styled-components";

const ProfileSetupModal = ({ userId, onComplete }) => {
  const {
    displayName,
    username,
    photoURL,
    saving,
    error,
    usernameError,
    displayNameError,
    checkingUsername,
    setPhotoURL,
    handleUsernameChange,
    handleUsernameBlur,
    handleDisplayNameChange,
    handleDisplayNameBlur,
    handleSave,
    isFormValid,
  } = useProfileSetup(userId, onComplete);

  return (
    <Overlay>
      <ModalContainer>
        <h1>Profile Setup</h1>

        <SecondaryInput
          placeholder="Display Name"
          value={displayName}
          onChange={handleDisplayNameChange}
          onBlur={handleDisplayNameBlur}
          error={displayNameError}
        />

        <UsernameInputWrapper>
          <SecondaryInput
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            onBlur={handleUsernameBlur}
            error={usernameError}
          />
          {checkingUsername && (
            <StatusText $type="checking">Checking...</StatusText>
          )}
          {username && !usernameError && !checkingUsername && (
            <StatusText $type="success">✓ Username available</StatusText>
          )}
        </UsernameInputWrapper>

        <ImageFileInput onUpload={setPhotoURL} />

        <ButtonContainer>
          <PrimaryButton onClick={handleSave} disabled={!isFormValid}>
            {saving ? "Saving..." : "Create Profile"}
          </PrimaryButton>
        </ButtonContainer>

        {error && <StatusText $type="error">{error}</StatusText>}
      </ModalContainer>
    </Overlay>
  );
};

// Keep all styles in the same file
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
`;

const UsernameInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 512px;
  margin: 0 auto;
`;

const StatusText = styled.p`
  font-size: 12px;
  margin: 4px 0 0 0;
  color: ${({ $type }) => {
    switch ($type) {
      case "checking":
        return "#999";
      case "error":
        return "#ff4343";
      case "success":
        return "#4caf50";
      default:
        return "#999";
    }
  }};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;

  button {
    width: 200px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

export default ProfileSetupModal;

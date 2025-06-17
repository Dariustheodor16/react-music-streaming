import { useState } from "react";
import { useAuth } from "../services/auth/AuthContext";
import Navbar from "../components/blocks/Navbar/Navbar";
import LibraryDisplay from "../components/blocks/LibraryBlocks/LibraryDisplay";
import LoginModal from "../components/ui/Modals/LoginModal";
import ProfileSetupModal from "../components/ui/Modals/ProfileSetupModal";
import PrimaryButton from "../components/ui/Buttons/PrimaryButton";
import styled from "styled-components";

const Library = () => {
  const { userLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);

  const openLoginModal = () => {
    setRegisterMode(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setRegisterMode(true);
    setShowLoginModal(true);
  };

  const handleRegistered = (userId) => {
    setShowLoginModal(false);
    setProfileUserId(userId);
    setShowProfileSetup(true);
  };

  return (
    <>
      <Navbar
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />
      <Container>
        {userLoggedIn ? (
          <LibraryDisplay />
        ) : (
          <GuestLibraryWrapper>
            <GuestPromptSection>
              <GuestPromptContainer>
                <GuestPromptTitle>
                  Your personal music library awaits
                </GuestPromptTitle>
                <GuestPromptSubtext>
                  Create playlists, save your favorite songs and albums, and
                  build your perfect music collection. All your music, organized
                  just the way you like it.
                </GuestPromptSubtext>
                <GuestPromptActions>
                  <PrimaryButton onClick={openLoginModal}>
                    Log In to Access Library
                  </PrimaryButton>
                  <GuestPromptLink onClick={openRegisterModal}>
                    Don't have an account? Sign up free
                  </GuestPromptLink>
                </GuestPromptActions>
              </GuestPromptContainer>
            </GuestPromptSection>
          </GuestLibraryWrapper>
        )}
      </Container>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialRegister={registerMode}
          onRegistered={handleRegistered}
        />
      )}
      {showProfileSetup && profileUserId && (
        <ProfileSetupModal
          userId={profileUserId}
          onComplete={() => setShowProfileSetup(false)}
        />
      )}
    </>
  );
};

const Container = styled.div`
  width: 100vw;
  max-width: 1190px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 62px;
  box-sizing: border-box;
  background: #232323;
  min-height: 100vh;
`;

const GuestLibraryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  min-height: calc(100vh - 180px);
  padding: 0 20px;
  box-sizing: border-box;
`;

const GuestPromptSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 67, 67, 0.05) 0%,
    rgba(35, 35, 35, 0.8) 100%
  );
  border-radius: 24px;
  margin: 32px 0;
`;

const GuestPromptContainer = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const GuestPromptTitle = styled.h2`
  color: #fff;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600;
  margin: 0 0 24px 0;
  line-height: 1.2;
`;

const GuestPromptSubtext = styled.p`
  color: #d9d9d9;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.5;
  margin: 0 0 40px 0;
`;

const GuestPromptActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  button {
    width: 100%;
    max-width: 300px;
    height: 54px;
    font-size: 18px;
    font-weight: 600;
  }
`;

const GuestPromptLink = styled.a`
  color: #ff4343;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #e03e3e;
    text-decoration: underline;
  }
`;

export default Library;

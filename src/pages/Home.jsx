import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext";
import styled from "styled-components";
import Navbar from "../components/blocks/Navbar/Navbar";
import HeroBlock from "../components/blocks/LandingPageBlocks/HeroBlock";
import HomeContent from "../components/blocks/HomeBlocks/HomeContent";
import ControlBar from "../components/players/ControlBar";
import LoginModal from "../components/ui/Modals/LoginModal";
import ProfileSetupModal from "../components/ui/Modals/ProfileSetupModal";
import PrimaryButton from "../components/ui/Buttons/PrimaryButton";

const Home = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
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
      <MainWrapper>
        <Navbar
          openLoginModal={openLoginModal}
          openRegisterModal={openRegisterModal}
        />
        <ContentWrapper>
          {userLoggedIn ? (
            <HomeContent />
          ) : (
            <GuestContentWrapper>
              <GuestPromptSection>
                <GuestPromptContainer>
                  <GuestPromptTitle>
                    Ready to discover your next favorite song?
                  </GuestPromptTitle>
                  <GuestPromptSubtext>
                    Join thousands of music lovers. Create playlists, follow
                    artists, and never miss a beat.
                  </GuestPromptSubtext>
                  <GuestPromptActions>
                    <PrimaryButton onClick={openLoginModal}>
                      Log In to Get Started
                    </PrimaryButton>
                    <GuestPromptLink onClick={openRegisterModal}>
                      Don't have an account? Sign up free
                    </GuestPromptLink>
                  </GuestPromptActions>
                </GuestPromptContainer>
              </GuestPromptSection>
            </GuestContentWrapper>
          )}
        </ContentWrapper>
        <ControlBar />
      </MainWrapper>

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

const MainWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 120px;
  background: #232323;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;

const GuestContentWrapper = styled.div`
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
    rgba(25, 25, 25, 0.8) 100%
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

export default Home;

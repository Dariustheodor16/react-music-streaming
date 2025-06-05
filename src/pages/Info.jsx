import { useState } from "react";
import Navbar from "../components/blocks/Navbar/Navbar";
import HeroBlock from "../components/blocks/InfoBlocks/HeroBlock";
import CardsLayout from "../components/blocks/InfoBlocks/CardsLayout";
import LoginModal from "../components/blocks/Modals/LoginModal";
import ProfileSetupModal from "../components/blocks/Modals/ProfileSetupModal";

const Info = () => {
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
      <HeroBlock openRegisterModal={openRegisterModal} />
      <CardsLayout />
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

export default Info;

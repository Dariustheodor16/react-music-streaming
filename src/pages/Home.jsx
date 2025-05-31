import { useState } from "react";
import Navbar from "../components/blocks/Navbar/Navbar";
import LoginModal from "../components/blocks/Modals/LoginModal";
import ProfileSetupModal from "../components/blocks/Modals/ProfileSetupModal";
import ControlBar from "../components/players/ControlBar";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);

  // Example dummy song data for the control bar
  const dummySong = {
    imageUrl: "/mini-logo.svg",
    title: "Song name",
    artist: "Artist name",
  };

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

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialRegister={registerMode}
          onRegistered={handleRegistered}
        />
      )}
      {showProfileSetup &&
        profileUserId(
          <ProfileSetupModal
            userId={profileUserId}
            onComplete={() => setShowProfileSetup(false)}
          />
        )}
      <ControlBar song={dummySong} />
    </>
  );
};

export default Home;

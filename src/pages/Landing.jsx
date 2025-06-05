import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import HeroBlock from "../components/blocks/LandingPageBlocks/HeroBlock";
import SearchOrRedirectBlock from "../components/blocks/LandingPageBlocks/SearchOrRedirectBlock";
import SecondaryBlock from "../components/blocks/LandingPageBlocks/SecondaryBlock";
import LoginModal from "../components/blocks/Modals/LoginModal";
import ProfileSetupModal from "../components/blocks/Modals/ProfileSetupModal";

const Landing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            navigate("/home", { replace: true });
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
        }
      }
    };

    checkUserProfile();
  }, [currentUser, navigate]);

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
      <HeroBlock
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />
      <SearchOrRedirectBlock />
      <SecondaryBlock
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
      {showProfileSetup && profileUserId && (
        <ProfileSetupModal
          userId={profileUserId}
          onComplete={() => setShowProfileSetup(false)}
        />
      )}
    </>
  );
};

export default Landing;

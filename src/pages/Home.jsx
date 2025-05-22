import { useState } from "react";
import HeroBlock from "../components/blocks/LandingPageBlocks/HeroBlock";
import SearchOrRedirectBlock from "../components/blocks/LandingPageBlocks/SearchOrRedirectBlock";
import SecondaryBlock from "../components/blocks/LandingPageBlocks/SecondaryBlock";
import LoginModal from "../components/blocks/Modals/LoginModal";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);

  const openLoginModal = () => {
    setRegisterMode(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setRegisterMode(true);
    setShowLoginModal(true);
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
        />
      )}
    </>
  );
};

export default Home;

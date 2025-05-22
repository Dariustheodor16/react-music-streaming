import { useState } from "react";
import Navbar from "../components/blocks/Navbar/Navbar";
import HeroBlock from "../components/blocks/InfoBlocks/HeroBlock";
import CardsLayout from "../components/blocks/InfoBlocks/CardsLayout";
import LoginModal from "../components/blocks/Modals/LoginModal";

const Info = () => {
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
        />
      )}
    </>
  );
};

export default Info;

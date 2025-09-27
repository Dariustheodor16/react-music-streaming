import { createContext, useContext, useState } from "react";
import LoginModal from "../../components/ui/Modals/LoginModal";

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
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
    <LoginModalContext.Provider value={{ openLoginModal, openRegisterModal }}>
      {children}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialRegister={registerMode}
        />
      )}
    </LoginModalContext.Provider>
  );
};
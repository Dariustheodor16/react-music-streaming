import styled from "styled-components";
import logo from "../../../assets/logo.png";
import miniLogo from "../../../assets/mini-logo.svg";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/authContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase";

const Navbar = ({ openLoginModal, openRegisterModal }) => {
  const { currentUser, userLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [currentUser]);

  return (
    <Container>
      <NavbarContainer>
        <Link to={"/"} className="logo-link">
          <img src={logo} alt="Logo" className="main-logo" />
          <img src={miniLogo} alt="Mini Logo" className="mini-logo" />
        </Link>
        <AnchorContainer>
          <a href="#">Home</a>
          <a href="#">Library</a>
        </AnchorContainer>

        <StyledPrimaryInput>
          <PrimaryInput />
        </StyledPrimaryInput>
        <LoginContainer>
          {!userLoggedIn ? (
            <>
              <LoginAnchor onClick={openLoginModal}>Log In</LoginAnchor>
              <PrimaryButton
                onClick={openRegisterModal}
                className="navbar-primary-btn"
              >
                Register
              </PrimaryButton>
              <LoginAnchor onClick={openLoginModal}>Upload</LoginAnchor>
            </>
          ) : (
            <>
              <LoginAnchor
                className="upload-anchor-loggedin"
                onClick={() => navigate("/upload")}
              >
                Upload
              </LoginAnchor>
              {profile && profile.photoURL ? (
                <ProfileImg
                  src={profile.photoURL}
                  alt="Profile"
                  onClick={() => (window.location.href = "/profile")}
                />
              ) : (
                <ProfileFallback
                  onClick={() => (window.location.href = "/profile")}
                >
                  {profile && profile.displayName
                    ? profile.displayName[0].toUpperCase()
                    : "U"}
                </ProfileFallback>
              )}
            </>
          )}
        </LoginContainer>
      </NavbarContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #232323;

  .logo-link {
    display: flex;
    align-items: center;
  }

  .main-logo {
    width: 130px;
    height: 37px;
    object-fit: contain;
    display: block;
  }
  .mini-logo {
    display: none;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 1190px) {
    .main-logo {
      width: 120px;
      height: 34px;
    }
  }
  @media (max-width: 600px) {
    .main-logo {
      display: none;
    }
    .mini-logo {
      display: block;
      width: 36px;
      height: 36px;
    }
  }
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  min-width: 0;
  padding: 0 16px;
`;

const AnchorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
  margin-left: 26px;
  margin-right: 26px;

  a {
    font-size: 24px;
    text-decoration: none;
    cursor: pointer;
    color: #fff;
    font-weight: 300;
    &:hover {
      color: #ff4343;
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 11px;
  align-items: center;
  margin-left: 15px;
`;

const LoginAnchor = styled.a`
  cursor: pointer;
  font-size: 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  margin-right: 12px;

  &.upload-anchor-loggedin {
    margin-right: 42px;
  }
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  cursor: pointer;
`;

const ProfileFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

const StyledPrimaryInput = styled.div`
  width: 500px;
  min-width: 80px;
  max-width: 500px;
  display: flex;
  align-items: center;

  input {
    border-radius: 8px;
    height: 34px;
    min-height: 28px;
    max-height: 34px;
    width: 100%;
    font-size: 16px;
    &::placeholder {
      font-size: 14px;
    }
  }
  @media (max-width: 1160px) {
    width: 380px;
  }
  @media (max-width: 1070px) {
    width: 310px;
  }
  @media (max-width: 990px) {
    width: 210px;
  }

  @media (max-width: 800px) {
    width: 320px;
    input {
      height: 28px;
      font-size: 15px;
    }
  }
  @media (max-width: 600px) {
    width: 220px;
    input {
      height: 24px;
      font-size: 14px;
    }
  }
`;

export default Navbar;

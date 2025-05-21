import styled from "styled-components";
import logo from "../../../assets/logo.png";
import miniLogo from "../../../assets/mini-logo.svg";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Container>
      <NavbarContainer>
        <Link to={"/"} className="logo-link">
          <img src={logo} alt="Logo" className="main-logo" />
          <img src={miniLogo} alt="Mini Logo" className="mini-logo" />
        </Link>
        <div className="anchorContainer">
          <a href="#">Home</a>
          <a href="#">Library</a>
        </div>

        <StyledPrimaryInput>
          <PrimaryInput />
        </StyledPrimaryInput>
        <div className="loginContainer">
          <a href="#">Log In</a>
          <PrimaryButton className="navbar-primary-btn">Register</PrimaryButton>
          <a href="#">Upload</a>
        </div>
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

  .anchorContainer {
    display: flex;
    flex-direction: row;
    gap: 32px;
    align-items: center;
    margin-left: 26px;
    margin-right: 26px;
  }

  .anchorContainer a {
    font-size: 24px;
    text-decoration: none;
    color: #fff;
    font-weight: 300;
    &:hover {
      color: #ff4343;
    }
  }

  .loginContainer {
    display: flex;
    flex-direction: row;
    gap: 11px;
    align-items: center;
    margin-left: 15px;
  }

  .loginContainer a {
    font-size: 15px;
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    white-space: nowrap;
    margin-right: 12px;
  }

  .navbar-primary-btn {
    width: 120px;
    height: 34px;
    font-size: 16px;
    text-align: center;
    padding: 0 16px;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
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

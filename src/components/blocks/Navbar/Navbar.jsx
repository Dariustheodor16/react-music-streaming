import styled from "styled-components";
import logo from "../../../assets/logo.png";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Container>
      <NavbarContainer>
        <Link to={"/"}>
          <img src={logo}></img>
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
  width: 100%;

  img {
    width: 10.156vw;
    height: 2.865vw;
    object-fit: contain;
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
    font-size: 1.25vw;
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
    margin-left: 1.563vw;
  }

  .loginContainer a {
    font-size: 0.781vw;
    text-decoration: none;
    color: #fff;
    font-weight: 300;
  }

  .navbar-primary-btn {
    width: 120px;
    height: 34px;
    font-size: 1rem;
    text-align: center;
    padding: 0 24px;
    border-radius: 0.313vw;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  min-width: 0;
`;

const StyledPrimaryInput = styled.div`
  width: 26.042vw;
  height: 1.771vw;
  display: flex;
  align-items: center;

  input {
    border-radius: 0.469vw;
    height: 34px;
    min-height: 34px;
    max-height: 34px;
    width: 100%;
    font-size: 1rem;
    &::placeholder {
      font-size: 0.833vw;
    }
  }
`;

export default Navbar;

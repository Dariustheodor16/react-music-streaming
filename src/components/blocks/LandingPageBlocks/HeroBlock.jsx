import styled from "styled-components";
import logo from "../../../assets/logo.png";
import landingImg from "../../../assets/images/1-landing.png";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";

const HeroBlock = ({ openLoginModal, openRegisterModal }) => (
  <Container>
    <ImageContainer>
      <Logo src={logo} alt="Logo" />
      <img className="landing-img" src={landingImg} alt="crowd" />
      <div className="overlay">
        <h1>
          Where <span>Music</span> Finds Its People
        </h1>
        <p>
          Every <span>artist</span> starts somewhere.Upload your{" "}
          <span>music</span>, share your voice, and find your audience.The next
          big thing begins with <span>you</span>.
        </p>
        <div className="button-row">
          <PrimaryButton onClick={openLoginModal}>Log In</PrimaryButton>
          <SecondaryButton onClick={openRegisterModal}>
            Register
          </SecondaryButton>
        </div>
      </div>
    </ImageContainer>
  </Container>
);

const Container = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  margin-bottom: 50px;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .overlay h1 {
    color: #fff;
    font-size: clamp(2rem, 4vw, 3.417vw);
    margin-bottom: 16px;
    text-align: center;
    font-weight: 300;
    text-shadow: 0px 0px 22px #000000;
    max-width: 30.208vw;
  }
  .overlay span {
    color: #ff4343;
  }
  .overlay p {
    color: #d9d9d9;
    font-size: clamp(1rem, 2vw, 1.2vw);
    max-width: 36.458vw;
    text-align: center;
    margin-bottom: 32px;
    text-shadow: 0 2px 16px #000, 0 0px 2px #000;
  }
  .button-row {
    display: flex;
    gap: 16px;
  }
  .landing-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 24px;
  }

  @media (max-width: 900px) {
    padding-top: 16px;
    margin-bottom: 24px;
    .overlay h1,
    .overlay p {
      max-width: 90vw;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 90vw;
  max-width: 1472px;
  min-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    padding: 0;
  }

  @media (max-width: 650px) {
    .overlay {
      padding-top: 20px;
    }
    .overlay h1 {
      font-size: 1.3rem;
      max-width: 98vw;
    }
    .overlay p {
      font-size: 0.95rem;
      max-width: 98vw;
      margin-bottom: 20px;
    }
  }
`;

const Logo = styled.img`
  position: absolute;
  top: 32px;
  left: 32px;
  width: 13.542vw;
  height: auto;
  z-index: 2;
  border-radius: 12px;
  padding: 8px;
`;

export default HeroBlock;

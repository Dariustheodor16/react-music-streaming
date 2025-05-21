import styled from "styled-components";
import landingImg from "../../../assets/images/2-landing.png";
import SecondaryButton from "../../ui/Buttons/SecondaryButton";

const SecondaryBlock = () => {
  return (
    <Container>
      <ImageContainer>
        <img src={landingImg}></img>
        <div className="overlay">
          <h1>How it works</h1>
          <p>
            Upload your original tracks, build playlists, discover new artists,
            and grow your fanbase-all in one platform.
          </p>
        </div>
      </ImageContainer>
      <div className="cta-overlay">
        <h1>Love what you hear? Dive deeper.</h1>
        <p>Save tacks, follow artists, and build your sound. Free forever.</p>
        <SecondaryButton>Register now</SecondaryButton>
        <div className="login-redirect">
          <p>Already have an account?</p>
          <a href="#">Log in</a>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 30px;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
  }
  .overlay h1 {
    color: #fff;
    font-size: 3.417vw;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 300;
    text-shadow: 0px 0px 22px #000000;
    max-width: 30.208vw;
  }
  .overlay p {
    color: #d9d9d9;
    font-size: 1vw;
    max-width: 36.458vw;
    text-align: center;
    margin-bottom: 32px;
    text-shadow: 0 2px 16px #000, 0 0px 2px #000;
  }
  .cta-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .cta-overlay h1 {
    color: #fff;
    font-size: 2.5vw;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 300;
  }
  .cta-overlay p {
    color: #d9d9d9;
    font-size: 1vw;
    font-weight: 300;
  }
  .login-redirect {
    display: flex;
    align-items: center;
  }
  .login-redirect p {
    color: #d9d9d9;
    font-size: 0.781vw;
  }
  .login-redirect a {
    color: #ff4343;
    font-size: 0.781vw;
    margin-left: 12px;
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
`;

export default SecondaryBlock;

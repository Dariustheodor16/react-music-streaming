import styled from "styled-components";
import infoImg from "../../../assets/images/1-info.png";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";

const HeroBlock = () => {
  return (
    <Container>
      <img className="landing-img" src={infoImg} alt="albums" />
      <div className="overlay">
        <h1>
          Your <span>artist</span> journey starts here
        </h1>
        <p>
          Share your tracks, connect with your audience, and access powerful
          tools to build your legacy.
        </p>
        <PrimaryButton className="hero-btn">
          Upload your first song
        </PrimaryButton>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  margin-bottom: 50px;
  position: relative;

  .landing-img {
    width: 100%;
    max-width: 1170px;
    border-radius: 1.2rem;
    display: block;
    margin: 0 auto;
    height: auto;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1170px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 2vw;
  }
  .overlay h1 {
    color: #fff;
    font-size: clamp(1.3rem, 3.333vw, 2.5rem);
    margin-bottom: 16px;
    text-align: center;
    font-weight: 600;
    text-shadow: 0px 0px 22px #000000;
    max-width: 30.865vw;
  }
  .overlay span {
    color: #ff4343;
  }
  .overlay p {
    color: #d9d9d9;
    font-size: clamp(1rem, 1.2vw, 1.3rem);
    max-width: 36.458vw;
    text-align: center;
    margin-bottom: 32px;
    text-shadow: 0 2px 16px #000, 0 0px 2px #000;
  }
  .hero-btn {
    width: clamp(180px, 12vw, 240px);
    min-width: 180px;
    max-width: 320px;
    height: clamp(48px, 2.5vw, 56px);
    min-height: 44px;
    max-height: 56px;
    font-size: clamp(1rem, 1vw, 1.15rem);
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 1170px) {
    .landing-img,
    .overlay {
      max-width: 100vw;
      border-radius: 0.7rem;
    }
    .overlay h1,
    .overlay p {
      max-width: 98vw;
    }
  }

  @media (max-width: 700px) {
    .overlay h1 {
      font-size: 1.3rem;
    }
    .overlay p {
      font-size: 0.95rem;
      max-width: 70vw;
    }
    .hero-btn {
      width: 30vw;
      max-width: 320px;
      min-width: 120px;
      height: 34px;
      font-size: 1rem;
    }
  }
`;

export default HeroBlock;

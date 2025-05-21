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

  img {
    border-radius: 1.2rem;
  }

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
    font-size: 3.333vw;
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
    font-size: 1vw;
    max-width: 36.458vw;
    text-align: center;
    margin-bottom: 32px;
    text-shadow: 0 2px 16px #000, 0 0px 2px #000;
  }
  .hero-btn {
    width: 11.771vw;
    height: 1.865vw;
    font-size: 0.781vw;
  }
`;

export default HeroBlock;

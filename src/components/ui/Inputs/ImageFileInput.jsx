import styled from "styled-components";
import Image from "../../../assets/icons/Image.svg?react";
import PrimaryButton from "../Buttons/PrimaryButton";
import Line from "../../../assets/icons/dashed-line.svg?react";

const ImageFileInput = () => {
  return (
    <Container>
      <DashedBox>
        <Line />
        <Content>
          <Image />
          <h4>Drag and drop your image here</h4>
          <p>or</p>
          <PrimaryButton>Upload file</PrimaryButton>
        </Content>
      </DashedBox>

      <ButtonContainer>
        <PrimaryButton>Submit</PrimaryButton>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const DashedBox = styled.div`
  position: relative;
  width: 320px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  h4 {
    margin: 12px 0 4px 0;
    color: #fff;
  }
  p {
    margin: 0 0 12px 0;
    color: #d9d9d9;
  }
  button {
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: nowrap;

    width: 200px;
    height: 40px;
    font-size: 1.4rem;
  }
`;

const ButtonContainer = styled.div`
  button {
    width: 150px;
    height: 50px;
    font-size: 1.4rem;
    margin-top: 50px;
    text-align: center;
  }
`;

export default ImageFileInput;

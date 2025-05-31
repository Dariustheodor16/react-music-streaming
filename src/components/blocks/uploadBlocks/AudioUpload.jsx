import { useRef, useState } from "react";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import UploadIcon from "../../../assets/icons/upload.svg?react";
import CloseIcon from "../../../assets/icons/close.svg?react";
import styled from "styled-components";
import QuitUploadModal from "../Modals/QuitUploadModal";

const AudioUpload = ({ onUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [showQuitModal, setShowQuitModal] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => {
    if (file && onUploaded) {
      onUploaded(file);
    }
  };

  return (
    <Container>
      <CloseButtonStyled onClick={() => setShowQuitModal(true)}>
        <CloseIcon />
      </CloseButtonStyled>
      <Content>
        <h1>Upload your audio file</h1>
        <p>Use WAV, MP3, OGG, AAC, FLAC. The maximum file size is 10mb.</p>
        <DashedBox
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          style={{ cursor: "pointer" }}
        >
          <DashedContent>
            <UploadIconStyled />
            <Instruction>
              Drag and drop your audio file here or click to select a file
            </Instruction>
            <input
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {file && <FileName>Selected: {file.name}</FileName>}
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <PrimaryButton
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
              style={{ marginTop: 16 }}
            >
              Choose file
            </PrimaryButton>
          </DashedContent>
        </DashedBox>
      </Content>
      <NextButtonContainer>
        <PrimaryButton
          onClick={handleNext}
          disabled={!file}
          style={{ width: 200, fontSize: "1.3rem" }}
        >
          Next
        </PrimaryButton>
      </NextButtonContainer>
      <QuitUploadModal
        open={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onQuit={() => {
          window.location.href = "/home";
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: top;
  min-height: 100vh;
  padding-bottom: 100px;

  h1 {
    font-size: 3rem;
    color: #fff;
    margin-bottom: 12px;
    font-weight: 400;
  }
  p {
    color: #d9d9d9;
    font-size: 1.2rem;
    margin-bottom: 32px;
  }
`;

const CloseButtonStyled = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  svg {
    width: 52px;
    height: 52px;
  }

  svg path {
    stroke: #fff;
  }

  &:hover svg path {
    stroke: #ff4343;
  }
`;

const DashedBox = styled.div`
  width: 800px;
  height: 500px;
  border: 2px dashed #aaa;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px 0;
  background: #232323;
  position: relative;
`;

const DashedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const UploadIconStyled = styled(UploadIcon)`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Instruction = styled.p`
  text-align: center;
  margin-bottom: 24px;
  color: #d9d9d9;
  font-size: 18px;
`;

const FileName = styled.div`
  color: #fff;
  margin-bottom: 12px;
  font-size: 1.1rem;
  word-break: break-all;
`;

const ErrorMsg = styled.div`
  color: #ff4343;
  margin-bottom: 12px;
`;

const NextButtonContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  background: rgba(35, 35, 35, 0.95);
  padding: 24px 0;
  z-index: 20;
`;

export default AudioUpload;

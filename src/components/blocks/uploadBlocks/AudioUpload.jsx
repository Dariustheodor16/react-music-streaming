import { useRef, useState } from "react";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import UploadIcon from "../../../assets/icons/upload.svg?react";
import CloseIcon from "../../../assets/icons/close.svg?react";
import styled from "styled-components";
import QuitUploadModal from "../../ui/Modals/QuitUploadModal";
import { useFileUpload } from "../../../hooks/upload-hooks";
import { useNavigate } from "react-router-dom";

const allowedTypes = [
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mp3",
  "audio/mpeg",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
];

const AudioUpload = ({ onUploaded }) => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const {
    file,
    error,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload(allowedTypes, 10 * 1024 * 1024); // 10MB max

  const handleNext = () => {
    if (file && onUploaded) {
      onUploaded(file);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 1) {
      onUploaded(files);
    } else if (files.length === 1) {
      onUploaded(files[0]);
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
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current.click()}
          $isDragging={isDragging}
        >
          <DashedContent>
            <UploadIconStyled />
            <Instruction>
              {isDragging
                ? "Drop your audio file here!"
                : "Drag and drop your audio file here or click to browse"}
            </Instruction>
            <SubText>WAV, MP3, OGG, AAC, FLAC. Max 10MB.</SubText>
            <input
              type="file"
              accept="audio/*"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            {file && <FileName>Selected: {file.name}</FileName>}
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <BrowseLink
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              browse files
            </BrowseLink>
          </DashedContent>
        </DashedBox>
        <InfoText>
          Drag & drop your audio file here or click to browse
          <br />
          <small>Select multiple files to create an album or EP</small>
        </InfoText>
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
        onQuit={() => navigate("/home")}
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
  width: 100%;
  max-width: 800px;
  height: 500px;
  border: 2px dashed
    ${({ $isDragging }) => ($isDragging ? "#ff4343" : "#585858")};
  border-radius: 16px;
  background: ${({ $isDragging }) =>
    $isDragging ? "rgba(255, 67, 67, 0.1)" : "#232323"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${({ $isDragging }) =>
    $isDragging &&
    `
    transform: scale(1.02);
  `}

  &:hover {
    border-color: #ff4343;
    background: rgba(255, 67, 67, 0.05);
    transform: scale(1.01);
  }
`;

const DashedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: none;
`;

const UploadIconStyled = styled(UploadIcon)`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  opacity: 0.6;
`;

const Instruction = styled.p`
  text-align: center;
  margin-bottom: 8px;
  color: #fff;
  font-size: 18px;
  transition: color 0.2s ease;
`;

const SubText = styled.p`
  color: #888;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const FileName = styled.div`
  color: #fff;
  margin-bottom: 12px;
  font-size: 12px;
  background: rgba(255, 67, 67, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
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

const BrowseLink = styled.button`
  background: transparent;
  border: none;
  color: #ff4343;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
  pointer-events: auto;
  margin-top: 16px;

  &:hover {
    color: #ff6666;
  }
`;

const InfoText = styled.div`
  color: #d9d9d9;
  font-size: 1rem;
  text-align: center;
  margin-top: 16px;

  small {
    display: block;
    margin-top: 4px;
    font-size: 0.8rem;
    color: #888;
  }
`;

export default AudioUpload;

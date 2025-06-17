import styled from "styled-components";
import Image from "../../../assets/icons/Image.svg?react";
import Line from "../../../assets/icons/dashed-line.svg?react";
import { useState } from "react";
import {
  UPLOAD_LIMITS,
  CLOUDINARY_CONFIG,
} from "../../../constants/uploadLimits";

const CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET_IMAGES;
const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.CLOUD_NAME;

const ImageFileInput = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (selectedFile.size > UPLOAD_LIMITS.MAX_IMAGE_SIZE) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        if (onUpload) onUpload(data.secure_url);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  if (imageUrl) {
    return (
      <PreviewContainer>
        <PreviewImage src={imageUrl} alt="Profile" />
        <ChangeImageButton onClick={() => setImageUrl("")}>
          Change Image
        </ChangeImageButton>
      </PreviewContainer>
    );
  }

  return (
    <Container>
      <DashedBox
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        $isDragging={isDragging}
        $uploading={uploading}
      >
        <Content>
          {uploading ? (
            <>
              <LoadingSpinner />
              <h4>Uploading...</h4>
              <p>Please wait while we process your image</p>
            </>
          ) : (
            <>
              <Image />
              <h4>
                {isDragging
                  ? "Drop your image here"
                  : "Drag and drop your image here"}
              </h4>
              <p>or</p>
              <BrowseLink>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleInputChange}
                />
                browse files
              </BrowseLink>
              <FileInfo>
                {file && <span>Selected: {file.name}</span>}
                {error && <ErrorText>{error}</ErrorText>}
              </FileInfo>
            </>
          )}
        </Content>
      </DashedBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  width: 100%;
`;

const DashedBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 512px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: ${({ $uploading }) => ($uploading ? "wait" : "pointer")};
  border: 2px dashed #585858;
  border-radius: 16px;
  background: #232323;

  ${({ $isDragging }) =>
    $isDragging &&
    `
    transform: scale(1.02);
    border-color: #ff4343;
    background: rgba(255, 67, 67, 0.1);
  `}

  ${({ $uploading }) =>
    $uploading &&
    `
    pointer-events: none;
    opacity: 0.8;
  `}

  &:hover:not([disabled]) {
    transform: scale(1.01);
    border-color: #ff4343;
  }

  svg[data-line] {
    display: none;
  }
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
    text-align: center;
  }

  p {
    margin: 0 0 8px 0;
    color: #d9d9d9;
  }
`;

const BrowseLink = styled.label`
  color: #ff4343;
  text-decoration: underline;
  cursor: pointer;
  pointer-events: auto;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: #ff6666;
  }
`;

const FileInfo = styled.div`
  margin-top: 12px;
  text-align: center;

  span {
    color: #fff;
    font-size: 12px;
    background: rgba(255, 67, 67, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    display: block;
  }
`;

const ErrorText = styled.p`
  color: #ff4343 !important;
  font-size: 12px !important;
  margin: 4px 0 0 0 !important;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #333;
  border-top: 3px solid #ff4343;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const PreviewImage = styled.img`
  width: 320px;
  height: 220px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid #333;
`;

const ChangeImageButton = styled.button`
  background: transparent;
  border: 1px solid #585858;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff4343;
    color: #ff4343;
  }
`;

export default ImageFileInput;

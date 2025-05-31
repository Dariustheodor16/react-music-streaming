import styled from "styled-components";
import Image from "../../../assets/icons/Image.svg?react";
import PrimaryButton from "../Buttons/PrimaryButton";
import Line from "../../../assets/icons/dashed-line.svg?react";
import { useState } from "react";

const CLOUDINARY_UPLOAD_PRESET = "profile_pictures"; // your preset
const CLOUDINARY_CLOUD_NAME = "dky8gzzrx"; // your cloud name

const ImageFileInput = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
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
        setError("Upload failed.");
      }
    } catch (err) {
      setError("Upload failed.");
    }
    setUploading(false);
  };

  // If image is uploaded, show only the image
  if (imageUrl) {
    return (
      <PreviewContainer>
        <img src={imageUrl} alt="Profile" />
      </PreviewContainer>
    );
  }

  return (
    <Container>
      <DashedBox>
        <Line />
        <Content>
          <Image />
          <h4>Drag and drop your image here</h4>
          <p>or</p>
          <label>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleInputChange}
              disabled={uploading}
            />
            <PrimaryButton as="span" disabled={uploading}>
              Upload file
            </PrimaryButton>
          </label>
          {file && <p style={{ color: "#fff" }}>{file.name}</p>}
          {error && <p style={{ color: "#ff4343" }}>{error}</p>}
        </Content>
      </DashedBox>
      <ButtonContainer>
        <PrimaryButton onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Submit"}
        </PrimaryButton>
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
  label {
    pointer-events: auto;
  }
  span {
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    width: 70px;
    height: 20px;
    font-size: 1.2rem;
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

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 320px;
    max-height: 220px;
    border-radius: 16px;
    object-fit: cover;
  }
`;

export default ImageFileInput;

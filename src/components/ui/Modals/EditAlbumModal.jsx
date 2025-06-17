import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { albumService } from "../../../services/api";
import SecondaryInput from "../Inputs/SecondaryInput";
import ImageFileInput from "../Inputs/ImageFileInput";
import PrimaryButton from "../Buttons/PrimaryButton";
import CloseIcon from "../../../assets/icons/close.svg?react";

const EditAlbumModal = ({ isOpen, onClose, album, onUpdate }) => {
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && album) {
      setAlbumName(album.name || "");
      setDescription(album.description || "");
      setImageUrl(album.image || "");
      setError("");
    }
  }, [isOpen, album]);

  const handleSave = async () => {
    if (!albumName.trim()) {
      setError("Album name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const updates = {
        name: albumName.trim(),
        description: description.trim(),
        imageUrl: imageUrl,
      };

      await albumService.updateAlbum(album.id, updates);

      onUpdate({
        ...album,
        name: albumName.trim(),
        description: description.trim(),
        image: imageUrl,
      });

      onClose();
    } catch (error) {
      console.error("Error updating album:", error);
      setError("Failed to update album. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Edit Album</Title>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>

        <Content>
          <InputSection>
            <Label>Album Name</Label>
            <SecondaryInput
              placeholder="Enter album name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              disabled={isLoading}
            />
          </InputSection>

          <InputSection>
            <Label>Description</Label>
            <TextArea
              placeholder="Enter album description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </InputSection>

          <ImageSection>
            <Label>
              Album Cover
              <ImageNote>
                Changing the album cover will update the image for all songs in
                this album.
              </ImageNote>
            </Label>
            <ImageFileInput
              onUpload={setImageUrl}
              initialImage={imageUrl}
              disabled={isLoading}
            />
          </ImageSection>

          {error && <ErrorText>{error}</ErrorText>}
        </Content>

        <ButtonContainer>
          <SecondaryButton onClick={onClose} disabled={isLoading}>
            Cancel
          </SecondaryButton>
          <StyledPrimaryButton
            onClick={handleSave}
            disabled={isLoading || !albumName.trim()}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </StyledPrimaryButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );

  return createPortal(modalContent, document.body);
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    svg path {
      stroke: #ff4343;
    }
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Content = styled.div`
  padding: 32px;
`;

const InputSection = styled.div`
  margin-bottom: 24px;
`;

const ImageSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const ImageNote = styled.div`
  color: #d9d9d9;
  font-size: 14px;
  font-weight: 400;
  margin-top: 4px;
  font-style: italic;
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ff4343;
  }

  &::placeholder {
    color: #888;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid #333;
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid #585858;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #ff4343;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  width: 140px !important;
  height: 54px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
  white-space: nowrap !important;
`;

const ErrorText = styled.p`
  color: #ff4343;
  font-size: 14px;
  margin: 16px 0 0 0;
`;

export default EditAlbumModal;

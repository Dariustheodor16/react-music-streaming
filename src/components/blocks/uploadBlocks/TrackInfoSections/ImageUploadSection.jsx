import styled from "styled-components";
import IconSvg from "../../../../assets/icons/Image.svg?react";

const ImageUploadSection = ({
  isMultiUpload,
  albumData,
  imageUrl,
  isDragging,
  fileInputRef,
  handleImageUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}) => {
  if (isMultiUpload && albumData?.albumCoverUrl) {
    return (
      <AlbumCoverPreview>
        <PreviewImg src={albumData.albumCoverUrl} alt="Album cover" />
        <CoverLabel>Album Cover</CoverLabel>
      </AlbumCoverPreview>
    );
  }

  if (isMultiUpload) {
    return (
      <AlbumCoverPreview>
        <DefaultCover>
          <IconStyled />
          <p>Album Cover</p>
        </DefaultCover>
      </AlbumCoverPreview>
    );
  }

  return (
    <Label>
      Song Cover
      <DashedBox
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        $isDragging={isDragging}
      >
        {imageUrl ? (
          <PreviewImg src={imageUrl} alt="Song cover" />
        ) : (
          <DashedContent>
            <IconStyled />
            <InfoText>
              {isDragging
                ? "Drop your image here!"
                : "Drag & drop image or click to browse"}
            </InfoText>
            <SubText>JPG, PNG, GIF. Max 5MB. (WebP not supported)</SubText>
          </DashedContent>
        )}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </DashedBox>
    </Label>
  );
};

// Styled components
const Label = styled.label`
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlbumCoverPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CoverLabel = styled.p`
  color: #fff;
  margin-top: 12px;
  font-size: 1.1rem;
`;

const DefaultCover = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid #444;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #232323;

  p {
    color: #999;
    margin-top: 12px;
  }
`;

const DashedBox = styled.div`
  width: 300px;
  height: 300px;
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? "#ff4343" : "#aaa")};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isDragging }) =>
    $isDragging ? "rgba(255, 67, 67, 0.1)" : "#232323"};
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: #ff4343;
    background: rgba(255, 67, 67, 0.05);
  }
`;

const DashedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const InfoText = styled.p`
  color: #d9d9d9;
  font-size: 1rem;
  margin-bottom: 8px;
`;

const SubText = styled.p`
  color: #999;
  font-size: 0.85rem;
`;

const IconStyled = styled(IconSvg)`
  width: 60px;
  height: 60px;
  fill: #666;
  margin-bottom: 16px;
`;

const PreviewImg = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
`;

export default ImageUploadSection;

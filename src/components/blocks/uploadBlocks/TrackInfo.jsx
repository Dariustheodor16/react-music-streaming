import { useState } from "react";
import CloseIcon from "../../../assets/icons/close.svg?react";
import QuitUploadModal from "../../ui/Modals/QuitUploadModal";
import ArtistSelection from "./TrackInfoSections/ArtistSelection";
import GenreDropdown from "./TrackInfoSections/GenreDropdown";
import ImageUploadSection from "./TrackInfoSections/ImageUploadSection";
import { useTrackInfo } from "../../../hooks/upload-hooks/useTrackInfo";
import { useArtistManager } from "../../../hooks/upload-hooks/useArtistManager";
import { useImageUpload } from "../../../hooks/upload-hooks/useImageUpload";
import { useGenreDropdown } from "../../../hooks/upload-hooks/useGenreDropdown";
import {
  Container,
  Content,
  Left,
  Right,
  Label,
  Input,
  TextArea,
  ErrorMsg,
  BottomButtonContainer,
  CloseButtonStyled,
  ProgressHeader,
  ProgressBar,
  ProgressFill,
  AlbumInfo,
  FileName,
  BackButton,
  StyledPrimaryButton,
} from "./TrackInfoStyles";
import { useNavigate } from "react-router-dom";

const TrackInfo = ({
  audioFile,
  trackNumber = 1,
  totalTracks = 1,
  albumData = null,
  existingAlbumId = null,
  isMultiUpload = false,
  onTrackComplete,
  onBack,
  isLastTrack = true,
}) => {
  const [showQuitModal, setShowQuitModal] = useState(false);
  const navigate = useNavigate();

  const {
    trackTitle,
    setTrackTitle,
    artists,
    setArtists,
    genre,
    setGenre,
    description,
    setDescription,
    localError,
    setLocalError,
    loading,
    handleSubmit,
  } = useTrackInfo(
    audioFile,
    trackNumber,
    totalTracks,
    albumData,
    existingAlbumId,
    isMultiUpload,
    onTrackComplete
  );

  const {
    showArtistSearch,
    setShowArtistSearch,
    handleArtistSelect,
    handleRemoveArtist,
  } = useArtistManager(artists, setArtists);

  const {
    imageUrl,
    imageFile,
    isDragging,
    fileInputRef,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageUpload(setLocalError);

  const {
    genreSearch,
    setGenreSearch,
    dropdownOpen,
    setDropdownOpen,
    filteredGenres,
    handleGenreSelect,
  } = useGenreDropdown(genre, setGenre);

  const onSubmit = () => {
    handleSubmit(imageFile);
  };

  return (
    <Container>
      {isMultiUpload && (
        <ProgressHeader>
          <h2>
            Track {trackNumber} of {totalTracks}
          </h2>
          <ProgressBar>
            <ProgressFill $width={(trackNumber / totalTracks) * 100} />
          </ProgressBar>
          {albumData && <AlbumInfo>Album: {albumData.name}</AlbumInfo>}
          <FileName>File: {audioFile?.name}</FileName>
        </ProgressHeader>
      )}

      <CloseButtonStyled onClick={() => setShowQuitModal(true)}>
        <CloseIcon />
      </CloseButtonStyled>
      <h1>Track info</h1>

      <Content>
        <Left>
          <ImageUploadSection
            isMultiUpload={isMultiUpload}
            albumData={albumData}
            imageUrl={imageUrl}
            isDragging={isDragging}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
          />
        </Left>

        <Right>
          <Label>
            Track title
            <Input
              placeholder="Song name"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              disabled={loading}
            />
          </Label>

          <Label>
            Artists
            <ArtistSelection
              artists={artists}
              showArtistSearch={showArtistSearch}
              setShowArtistSearch={setShowArtistSearch}
              handleArtistSelect={handleArtistSelect}
              handleRemoveArtist={handleRemoveArtist}
              loading={loading}
            />
          </Label>

          <Label>
            Genre
            <GenreDropdown
              genre={genre}
              genreSearch={genreSearch}
              setGenreSearch={setGenreSearch}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              filteredGenres={filteredGenres}
              handleGenreSelect={handleGenreSelect}
              loading={loading}
            />
          </Label>

          <Label>
            Description
            <TextArea
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </Label>
        </Right>
      </Content>

      <BottomButtonContainer>
        {isMultiUpload && trackNumber > 1 && (
          <BackButton onClick={onBack}>← Previous Track</BackButton>
        )}
        <StyledPrimaryButton onClick={onSubmit} disabled={loading}>
          {loading
            ? "Uploading..."
            : isMultiUpload
            ? isLastTrack
              ? "Complete Album"
              : "Next Track"
            : "Upload Song"}
        </StyledPrimaryButton>
      </BottomButtonContainer>

      {localError && <ErrorMsg>{localError}</ErrorMsg>}

      <QuitUploadModal
        open={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onQuit={() => navigate("/home")}
      />
    </Container>
  );
};

export default TrackInfo;

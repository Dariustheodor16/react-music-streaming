import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import CloseIcon from "../../../assets/icons/close.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import QuitUploadModal from "../../ui/Modals/QuitUploadModal";
import ArtistSelection from "./TrackInfoSections/ArtistSelection";
import { useArtistManager } from "../../../hooks/upload-hooks/useArtistManager";

const AlbumCreator = ({
  trackCount,
  trackNames,
  onAlbumDataSet,
  onBack,
  onRemoveTrack,
  onAddMoreTracks,
}) => {
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");
  const [albumType, setAlbumType] = useState("album");
  const [artists, setArtists] = useState([]);
  const [releaseDate, setReleaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [albumCoverUrl, setAlbumCoverUrl] = useState("");
  const [albumCoverFile, setAlbumCoverFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const fileInputRef = useRef(null);
  const additionalFilesInputRef = useRef(null);

  const {
    showArtistSearch,
    setShowArtistSearch,
    handleArtistSelect,
    handleRemoveArtist,
  } = useArtistManager(artists, setArtists);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAlbumCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumCoverUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setAlbumCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumCoverUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!albumName.trim() || artists.length === 0 || !albumCoverFile) {
      alert(
        "Please fill in all fields, add at least one artist, and upload an album cover"
      );
      return;
    }

    if (trackCount === 0) {
      alert("You must have at least one track to create an album");
      return;
    }

    const primaryArtist = artists[0];

    onAlbumDataSet({
      name: albumName.trim(),
      type: albumType,
      artist: primaryArtist.displayName,
      artists: artists,
      releaseDate: releaseDate,
      albumCoverFile: albumCoverFile,
      albumCoverUrl: albumCoverUrl,
    });
  };

  const handleRemoveTrack = (index) => {
    if (trackCount <= 1) {
      alert("An album must have at least one track");
      return;
    }
    onRemoveTrack(index);
  };

  const handleAddMoreTracks = () => {
    additionalFilesInputRef.current?.click();
  };

  const handleAdditionalFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

    if (audioFiles.length === 0) {
      alert("Please select valid audio files.");
      return;
    }

    const MAX_ALBUM_TRACKS = 20;
    if (trackCount + audioFiles.length > MAX_ALBUM_TRACKS) {
      alert(
        `Maximum ${MAX_ALBUM_TRACKS} tracks allowed per album. You currently have ${trackCount} tracks.`
      );
      return;
    }

    onAddMoreTracks(audioFiles);

    e.target.value = "";
  };

  const handleClose = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowQuitModal(true);
  };

  return (
    <Container>
      <CloseButtonStyled onClick={handleClose}>
        <CloseIcon />
      </CloseButtonStyled>

      <HeaderSection>
        <h1>Create {albumType === "album" ? "Album" : "EP"}</h1>
      </HeaderSection>

      <Content>
        <LeftSection>
          <Label>
            Album Cover
            <DashedBox
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              $isDragging={isDragging}
            >
              {albumCoverUrl ? (
                <PreviewImg src={albumCoverUrl} alt="Album cover" />
              ) : (
                <DashedContent>
                  <InfoText>
                    {isDragging
                      ? "Drop your album cover here!"
                      : "Drag & drop album cover or click to browse"}
                  </InfoText>
                  <SubText>JPG, JPEG, PNG. Max 5MB.</SubText>
                </DashedContent>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </DashedBox>
          </Label>
        </LeftSection>

        <MiddleSection>
          <TrackPreview>
            <TrackPreviewHeader>
              <h3>Tracks to upload ({trackCount}):</h3>
            </TrackPreviewHeader>
            <TrackList>
              {trackNames.map((name, index) => (
                <TrackItem key={index}>
                  <TrackInfo>
                    <TrackNumber>{index + 1}.</TrackNumber>
                    <TrackName>{name}</TrackName>
                  </TrackInfo>
                  {trackCount > 1 && (
                    <RemoveTrackButton
                      onClick={() => handleRemoveTrack(index)}
                      title={`Remove "${name}" from album`}
                    >
                      <DeleteIcon />
                    </RemoveTrackButton>
                  )}
                </TrackItem>
              ))}
            </TrackList>
            <AddMoreTracksSection>
              <AddMoreTracksButton
                onClick={handleAddMoreTracks}
                title="Add more audio files to this album"
              >
                + Add More Tracks
              </AddMoreTracksButton>
              <AddMoreTracksNote>
                Click to browse and select additional audio files
              </AddMoreTracksNote>
              <input
                type="file"
                accept="audio/*"
                multiple
                style={{ display: "none" }}
                ref={additionalFilesInputRef}
                onChange={handleAdditionalFiles}
              />
            </AddMoreTracksSection>
            {trackCount === 1 && (
              <MinimumTrackNote>
                Minimum 1 track required for album
              </MinimumTrackNote>
            )}
          </TrackPreview>
        </MiddleSection>

        <RightSection>
          <AlbumForm>
            <Label>
              Album Name
              <Input
                placeholder="Enter album name"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
              />
            </Label>

            <Label>
              Album Type
              <Select
                value={albumType}
                onChange={(e) => setAlbumType(e.target.value)}
              >
                <option value="album">Album</option>
                <option value="EP">EP</option>
              </Select>
            </Label>

            <Label>
              Album Artists
              <ArtistSelection
                artists={artists}
                showArtistSearch={showArtistSearch}
                setShowArtistSearch={setShowArtistSearch}
                handleArtistSelect={handleArtistSelect}
                handleRemoveArtist={handleRemoveArtist}
                loading={false}
              />
            </Label>

            <Label>
              Release Date
              <Input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </Label>
          </AlbumForm>
        </RightSection>
      </Content>

      <ButtonSection>
        <PrimaryButton
          onClick={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Continue
        </PrimaryButton>
      </ButtonSection>

      {showQuitModal && (
        <QuitUploadModal
          open={showQuitModal}
          onClose={() => setShowQuitModal(false)}
          onQuit={() => navigate("/")}
        />
      )}
    </Container>
  );
};

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #232323;
  color: #fff;
  position: relative;
  padding: 24px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    color: #fff;
  }
`;

const Content = styled.div`
  display: flex;
  gap: 48px;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const MiddleSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #fff;
`;

const DashedBox = styled.div`
  width: 100%;
  height: 300px;
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? "#ff4343" : "#666")};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #ff4343;
  }
`;

const DashedContent = styled.div`
  text-align: center;
  padding: 20px;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #d9d9d9;
  margin: 0 0 8px 0;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const TrackPreview = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #fff;
  }
`;

const TrackPreviewHeader = styled.div`
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #fff;
  }
`;

const TrackList = styled.div`
  background: #191919;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  color: #d9d9d9;
  font-size: 14px;
  border-bottom: 1px solid #333;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    padding: 12px 8px;
    margin: 0 -8px;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const TrackNumber = styled.span`
  color: #888;
  font-weight: 500;
  min-width: 20px;
`;

const TrackName = styled.span`
  color: #fff;
  truncate: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const RemoveTrackButton = styled.button`
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid rgba(255, 67, 67, 0.3);
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;

  svg {
    width: 12px;
    height: 12px;
    fill: #ff4343;
  }

  &:hover {
    background: rgba(255, 67, 67, 0.2);
    border-color: rgba(255, 67, 67, 0.5);
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddMoreTracksSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #333;
  text-align: center;
`;

const AddMoreTracksButton = styled.button`
  background: rgba(255, 67, 67, 0.1);
  border: 1px dashed rgba(255, 67, 67, 0.5);
  border-radius: 8px;
  padding: 12px 24px;
  color: #ff4343;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 8px;

  &:hover {
    background: rgba(255, 67, 67, 0.2);
    border-color: rgba(255, 67, 67, 0.7);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddMoreTracksNote = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
  font-style: italic;
`;

const MinimumTrackNote = styled.p`
  font-size: 12px;
  color: #888;
  margin: 12px 0 0 0;
  text-align: center;
  font-style: italic;
`;

const AlbumForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: #ff4343;
  }

  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: #ff4343;
  }

  option {
    background: #333;
    color: #fff;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 56px;
`;

export default AlbumCreator;

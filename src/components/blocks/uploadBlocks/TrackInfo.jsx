import { useState, useRef } from "react";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import IconSvg from "../../../assets/icons/Image.svg?react";
import ArrowIcon from "../../../assets/icons/arrow.svg?react";
import CloseIcon from "../../../assets/icons/close.svg?react";
import styled from "styled-components";
import { useAuth } from "../../../services/authContext";
import { firestore } from "../../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import QuitUploadModal from "../Modals/QuitUploadModal";

const CLOUDINARY_UPLOAD_PRESET = "audio_upload";
const CLOUDINARY_CLOUD_NAME = "dky8gzzrx";

const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Jazz",
  "Electronic",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Other",
];

const TrackInfo = ({ onSubmit, uploadingImage, error, audioFile }) => {
  const { currentUser } = useAuth();
  const [trackTitle, setTrackTitle] = useState(
    audioFile && audioFile.name ? audioFile.name.replace(/\.[^/.]+$/, "") : ""
  );
  const [artists, setArtists] = useState([]);
  const [artistInput, setArtistInput] = useState("");
  const [genre, setGenre] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [description, setDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const fileInputRef = useRef();

  const filteredGenres = genreSearch
    ? GENRES.filter((g) => g.toLowerCase().includes(genreSearch.toLowerCase()))
    : GENRES;

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const uploadToCloudinary = async (file, resourceType = "video") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleArtistInputChange = (e) => {
    const value = e.target.value;

    if (value.endsWith(",")) {
      const name = value.slice(0, -1).trim();
      if (name && !artists.includes(name)) {
        setArtists([...artists, name]);
      }
      setArtistInput("");
    } else {
      setArtistInput(value);
    }
  };

  const handleRemoveArtist = (name) => {
    setArtists(artists.filter((a) => a !== name));
  };

  const handleSubmit = async () => {
    setLocalError("");
    if (
      !trackTitle.trim() ||
      artists.length === 0 ||
      !genre.trim() ||
      !description.trim() ||
      !imageFile ||
      !audioFile
    ) {
      setLocalError("Please fill in all fields and select an image.");
      return;
    }
    if (!currentUser) {
      setLocalError("You must be logged in to upload.");
      return;
    }
    setLoading(true);
    try {
      const uploadedImageUrl = await uploadToCloudinary(imageFile, "image");
      const uploadedAudioUrl = await uploadToCloudinary(audioFile, "video");
      await addDoc(collection(firestore, "tracks"), {
        title: trackTitle,
        artists,
        genre,
        description,
        imageUrl: uploadedImageUrl,
        audioUrl: uploadedAudioUrl,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      window.location.href = "/profile";
    } catch (err) {
      setLoading(false);
      setLocalError("Upload failed. Please try again.");
    }
  };

  return (
    <Container>
      <CloseButtonStyled onClick={() => setShowQuitModal(true)}>
        <CloseIcon />
      </CloseButtonStyled>
      <h1>Track info</h1>
      <Content>
        <Left>
          <DashedBox onClick={() => fileInputRef.current.click()}>
            <DashedContent>
              {imageUrl ? (
                <PreviewImg src={imageUrl} alt="Track cover" />
              ) : (
                <>
                  <IconStyled />
                  <InfoText>
                    Use JPG, JPEG, PNG. The maximum file size is 5mb.
                  </InfoText>
                </>
              )}
              <PrimaryButton
                as="span"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
              >
                Upload file
              </PrimaryButton>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={loading}
              />
              {error && <ErrorMsg>{error}</ErrorMsg>}
            </DashedContent>
          </DashedBox>
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
            <ArtistsInputWrapper>
              {artists.map((name) => (
                <ArtistTag key={name}>
                  {name}
                  <RemoveArtistBtn
                    type="button"
                    onClick={() => handleRemoveArtist(name)}
                  >
                    <CloseIcon />
                  </RemoveArtistBtn>
                </ArtistTag>
              ))}
              <ArtistInput
                placeholder="Sepparate names with commas"
                value={artistInput}
                onChange={handleArtistInputChange}
                disabled={loading}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    artistInput === "" &&
                    artists.length > 0
                  ) {
                    handleRemoveArtist(artists[artists.length - 1]);
                  }
                }}
              />
            </ArtistsInputWrapper>
          </Label>
          <Label>
            Genre
            <DropdownContainer>
              <DropdownInput
                placeholder="Search for genre"
                value={dropdownOpen ? genreSearch : genre}
                onChange={(e) => {
                  setGenreSearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => {
                  setDropdownOpen(true);
                  setGenreSearch(genre);
                }}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                onClick={() => {
                  setDropdownOpen(true);
                  setGenreSearch(genre);
                }}
                disabled={loading}
              />
              <ArrowWrapper open={dropdownOpen}>
                <ArrowIcon />
              </ArrowWrapper>
              {dropdownOpen && (
                <DropdownList>
                  {filteredGenres.map((g) => (
                    <DropdownItem
                      key={g}
                      onMouseDown={() => {
                        setGenre(g);
                        setGenreSearch("");
                        setDropdownOpen(false);
                      }}
                    >
                      {g}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
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
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? "Uploading..." : "Upload song"}
        </PrimaryButton>
      </BottomButtonContainer>
      {(localError || error) && <ErrorMsg>{localError || error}</ErrorMsg>}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;

  h1 {
    font-size: 3rem;
    color: #fff;
    margin-bottom: 12px;
    font-weight: 400;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
  margin-top: 24px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DashedBox = styled.div`
  width: 500px;
  height: 500px;
  border: 2px dashed #aaa;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #232323;
  position: relative;
  cursor: pointer;
`;

const DashedContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 30px;
    white-space: nowrap;
    margin-top: 12px;
  }
`;

const IconStyled = styled(IconSvg)`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const InfoText = styled.p`
  color: #d9d9d9;
  font-size: 1.1rem;
  margin-top: 18px;
  text-align: center;
`;

const PreviewImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 18px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 350px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  height: 44px;
  width: 100%;
  padding-left: 16px;
  font-size: 1rem;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownInput = styled(Input)`
  width: 100%;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  width: 100%;
  background: #232323;
  border: 1px solid #aaa;
  border-radius: 8px;
  z-index: 10;
  max-height: 120px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #ff4343;
    color: #fff;
  }
`;

const TextArea = styled.textarea`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  width: 336px;
  min-height: 80px;
  padding: 12px 16px;
  font-size: 1rem;
  resize: vertical;
`;

const ErrorMsg = styled.div`
  color: #ff4343;
  margin-top: 12px;
`;

const BottomButtonContainer = styled.div`
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

const ArrowWrapper = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s;
    transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const ArtistsInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  width: 368px;
  background: #d9d9d9;
  border-radius: 10px;
`;

const ArtistTag = styled.span`
  display: flex;
  align-items: center;
  background: #ff4343;
  color: #fff;
  border-radius: 16px;
  padding: 4px 10px 4px 12px;
  font-size: 1rem;
  margin: 2px 0;
`;

const RemoveArtistBtn = styled.button`
  background: none;
  border: none;
  margin-left: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  svg {
    width: 14px;
    height: 14px;
    stroke: #fff;
  }
`;

const ArtistInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  flex: 1;
  color: #3d3131;
  padding-left: 16px;
  height: 44px;
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

export default TrackInfo;

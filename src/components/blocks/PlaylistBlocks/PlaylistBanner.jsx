import { useState, useEffect } from "react";
import { useAudio } from "../../../services/AudioContext";
import { usePlaylist } from "../../../services/PlaylistContext";
import { useColorExtraction } from "../../../hooks/profile-hooks/useColorExtraction";
import EmptyPlayIcon from "../../../assets/icons/play.svg?react";
import PauseIcon from "../../../assets/icons/pause.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import styled from "styled-components";

const PlaylistBanner = ({
  playlist,
  tracks = [],
  onDelete,
  isTemporary = false,
}) => {
  const { playSong, isPlaying, currentSong, pauseSong } = useAudio();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deletePlaylist } = usePlaylist();
  const getPlaylistImage = () => {
    if (tracks && tracks.length > 0 && tracks[0].image) {
      return tracks[0].image;
    }
    return "/mini-logo.svg";
  };

  const getGridImages = () => {
    if (tracks && tracks.length >= 4) {
      return tracks.slice(0, 4).map((track) => track.image || "/mini-logo.svg");
    }
    return [];
  };

  const actualPlaylistImage = getPlaylistImage();
  const gridImages = getGridImages();
  const showGrid = tracks.length >= 4;

  const { gradient, imgRef } = useColorExtraction(
    showGrid ? null : actualPlaylistImage
  );

  const isPlaylistPlaying = tracks.some(
    (track) => currentSong?.id === track.id && isPlaying
  );

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.log("Playlist image failed to load:", e.target.src);
    e.target.src = "/mini-logo.svg";
  };

  const handlePlay = () => {
    if (!tracks.length) return;

    if (isPlaylistPlaying) {
      pauseSong();
      return;
    }

    const firstTrack = tracks[0];
    const songData = {
      id: firstTrack.id,
      name: firstTrack.name,
      artist: firstTrack.artist,
      image: firstTrack.image,
      audioUrl: firstTrack.audioUrl,
      duration: firstTrack.duration || "--:--",
      genre: firstTrack.genre,
      description: firstTrack.description,
    };

    const playlistQueue = tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artist,
      image: track.image,
      audioUrl: track.audioUrl,
      duration: track.duration || "--:--",
      genre: track.genre,
      description: track.description,
    }));

    playSong(songData, playlistQueue);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deletePlaylist(playlist.id);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Banner style={gradient ? { background: gradient } : undefined}>
        {showGrid ? (
          <PlaylistGridContainer>
            {gridImages.map((img, index) => (
              <PlaylistGridItem
                key={index}
                src={img}
                alt={`Track ${index + 1}`}
                onError={handleImageError}
              />
            ))}
          </PlaylistGridContainer>
        ) : actualPlaylistImage && actualPlaylistImage !== "/mini-logo.svg" ? (
          <PlaylistCover
            src={actualPlaylistImage}
            alt={playlist.name}
            crossOrigin="anonymous"
            ref={imgRef}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <PlaylistCoverFallback>
            {playlist.name ? playlist.name[0].toUpperCase() : "P"}
          </PlaylistCoverFallback>
        )}

        <PlaylistInfo>
          <PlaylistName>{playlist.name}</PlaylistName>
          <CreatedBy>
            {isTemporary
              ? playlist.artist
              : `Created by ${playlist.createdBy || "You"}`}
          </CreatedBy>
          <SongCount>{tracks.length} Songs</SongCount>
        </PlaylistInfo>

        <RightSection>
          {!isTemporary && (
            <DeleteSection>
              <DeleteButton onClick={handleDeleteClick}>
                <DeleteIcon />
                Delete Playlist
              </DeleteButton>
            </DeleteSection>
          )}

          <PlaySection>
            <Duration>{tracks.length} Songs</Duration>
            <PlayButton onClick={handlePlay} disabled={!tracks.length}>
              {isPlaylistPlaying ? <PauseIcon /> : <EmptyPlayIcon />}
            </PlayButton>
          </PlaySection>
        </RightSection>
      </Banner>

      {showDeleteConfirm && !isTemporary && (
        <DeleteConfirmModal>
          <DeleteConfirmOverlay onClick={handleDeleteCancel} />
          <DeleteConfirmContent>
            <DeleteConfirmTitle>Delete Playlist</DeleteConfirmTitle>
            <DeleteConfirmMessage>
              Are you sure you want to delete "{playlist.name}"? This action
              cannot be undone.
            </DeleteConfirmMessage>
            <DeleteConfirmButtons>
              <DeleteConfirmCancel onClick={handleDeleteCancel}>
                Cancel
              </DeleteConfirmCancel>
              <DeleteConfirmDelete
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </DeleteConfirmDelete>
            </DeleteConfirmButtons>
          </DeleteConfirmContent>
        </DeleteConfirmModal>
      )}
    </>
  );
};
const PlaylistGridContainer = styled.div`
  width: 357px;
  height: 357px;
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 178.5px 178.5px;
  grid-template-rows: 178.5px 178.5px;
  gap: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
`;

const PlaylistGridItem = styled.img`
  width: 178.5px;
  height: 178.5px;
  object-fit: cover;
  display: block;
  border: none;
  margin: 0;
  padding: 0;
`;

const Banner = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  height: 498px;
  display: flex;
  align-items: center;
  border-radius: 24px;
  position: relative;
  margin-top: 32px;
  padding: 0 48px;
  box-sizing: border-box;

  ${({ style }) =>
    style?.background
      ? `
    background: ${style.background};
    transition: background 0.5s;
  `
      : `
    background: linear-gradient(120deg, rgb(27, 35, 27) 0%, rgb(195, 226, 201) 100%);
  `}
`;

const PlaylistCover = styled.img`
  width: 357px;
  height: 357px;
  border-radius: 18px;
  object-fit: cover;
  background: #232323;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const PlaylistCoverFallback = styled.div`
  width: 357px;
  height: 357px;
  border-radius: 18px;
  background: #666;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 128px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 48px;
  flex: 1;
  color: #fff;
`;

const PlaylistName = styled.h1`
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
`;

const CreatedBy = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const SongCount = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 357px;
  padding: 24px 0;
`;

const DeleteSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid rgba(255, 67, 67, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  color: #ff4343;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 67, 67, 0.2);
    border-color: rgba(255, 67, 67, 0.5);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const PlaySection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Duration = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg {
    width: 74px;
    height: 66px;
    fill: #fff;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const DeleteConfirmOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
`;

const DeleteConfirmContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #191919;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
`;

const DeleteConfirmTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
`;

const DeleteConfirmMessage = styled.p`
  font-size: 14px;
  color: #d9d9d9;
  line-height: 1.4;
  margin: 0 0 24px 0;

  strong {
    color: #fff;
  }
`;

const DeleteConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const DeleteConfirmCancel = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 16px;
  color: #d9d9d9;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const DeleteConfirmDelete = styled.button`
  background: #ff4343;
  border: 1px solid #ff4343;
  border-radius: 6px;
  padding: 8px 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e03d3d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default PlaylistBanner;

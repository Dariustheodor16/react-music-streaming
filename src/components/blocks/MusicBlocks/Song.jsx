import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../../../services/AudioContext";
import { useLikes } from "../../../services/LikeContext";
import { useDropdownMenu } from "../../../hooks/song-control-hooks";
import {
  PlayIconStyled,
  PlaySecondaryIconStyled,
  HeartIconStyled,
  FilledHeartIconStyled,
  BrokenHeartIconStyled,
  DotsIconStyled,
  AddPlaylistIconStyled,
  ArtistIconStyled,
  AlbumIconStyled,
  MusicIconStyled,
} from "../../../components/ui/Icons/SongIcons";
import AddToPlaylistModal from "../../ui/Modals/AddToPlaylistModal";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import { formatNumber } from "../../../utils/formatNumbers";

const Song = ({
  id,
  image,
  name,
  artist,
  duration,
  plays,
  audioUrl,
  genre,
  description,
  allSongs = [],
  albumId,
  playlistId,
  onRemoveFromPlaylist,
  uploaderUsername,
  onArtistClick,
  isGuestMode = false,
}) => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    getPlayCount,
    loadPlayCount,
  } = useAudio();
  const { isLiked, toggleLike } = useLikes();
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [realPlayCount, setRealPlayCount] = useState(0);
  const { showMenu, handleToggleMenu, handleCloseMenu } = useDropdownMenu();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const liked = isLiked(id);

  useEffect(() => {
    const loadRealPlayCount = async () => {
      const count = await loadPlayCount(id);
      setRealPlayCount(count);
    };

    loadRealPlayCount();
  }, [id, loadPlayCount]);

  useEffect(() => {
    const currentCount = getPlayCount(id);
    if (currentCount !== realPlayCount) {
      setRealPlayCount(currentCount);
    }
  }, [id, getPlayCount, realPlayCount]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (isGuestMode) {
      return;
    }
    toggleLike(id);
  };

  const handleSongNameClick = (e) => {
    e.stopPropagation();
    navigate(`/song/${id}`);
  };

  const handleSongClick = () => {
    const songData = {
      id,
      name,
      artist,
      image,
      audioUrl,
      duration,
      genre,
      description,
    };

    if (currentSong?.id === id && isPlaying) {
      pauseSong();
    } else {
      playSong(songData, allSongs);
    }
  };

  const handleMenuItemClick = async (action, callback, e) => {
    e.preventDefault();
    e.stopPropagation();
    handleCloseMenu();

    switch (action) {
      case "song":
        navigate(`/song/${id}`);
        break;
      case "playlist":
        setShowPlaylistModal(true);
        break;
      case "artist":
        handleGoToArtist();
        break;
      case "album":
        handleGoToAlbum();
        break;
      case "removeFromPlaylist":
        if (onRemoveFromPlaylist) {
          try {
            await onRemoveFromPlaylist(id);
          } catch (error) {
            console.error("Error removing song from playlist:", error);
            alert("Failed to remove song from playlist.");
          }
        }
        break;
      default:
        callback && callback();
    }
  };

  const handleGoToArtist = async () => {
    try {
      const { trackService } = await import("../../../services/api");
      const trackData = await trackService.getTrackById(id);

      const uploaderUserId = trackData?.uploadedBy || trackData?.userId;

      if (uploaderUserId) {
        const { userService } = await import("../../../services/api");
        const userData = await userService.getUserById(uploaderUserId);

        if (userData?.username) {
          navigate(`/profile/${userData.username}`);
          return;
        } else {
          console.warn("User found but no username:", userData);
        }
      } else {
        console.warn("No uploader field in track data:", trackData);
      }

      console.log("Could not find artist profile for this song");
    } catch (error) {
      console.error("Error navigating to artist:", error);
    }
  };

  const handleGoToAlbum = () => {
    if (albumId) {
      navigate(`/album/${albumId}`);
    }
  };

  const isCurrentSong = currentSong?.id === id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handleArtistNameClick = (e) => {
    e.stopPropagation();
    const firstArtist = artist ? artist.split(",")[0].trim() : "";

    if (firstArtist) {
      navigate(`/profile/${firstArtist}`);
    }
  };

  const menuItems = [
    {
      label: "Go to song",
      action: "song",
      icon: "song",
    },
    ...(!isGuestMode
      ? [
          {
            label: "Add to playlist",
            action: "playlist",
            icon: "playlist",
          },
        ]
      : []),
    ...(albumId && !isGuestMode
      ? [
          {
            label: "Go to album",
            action: "album",
            icon: "album",
          },
        ]
      : []),
    ...(onRemoveFromPlaylist && !isGuestMode
      ? [
          {
            label: "Remove from playlist",
            action: "removeFromPlaylist",
            icon: "delete",
          },
        ]
      : []),
  ];

  return (
    <Container
      className={`song ${isCurrentSong ? "current" : ""}`}
      $isCurrentSong={isCurrentSong}
      $isPlaying={isCurrentlyPlaying}
      onClick={handleSongClick}
    >
      <PlayingIndicator $show={isCurrentlyPlaying}>
        <PlaySecondaryIconStyled />
      </PlayingIndicator>

      <SongImg src={image} alt={name} />

      <SongInfo>
        <SongName $isPlaying={isCurrentlyPlaying} onClick={handleSongNameClick}>
          {name}
        </SongName>
        <SongArtist onClick={handleArtistNameClick}>{artist}</SongArtist>
        <SongDuration>{duration}</SongDuration>
      </SongInfo>

      <PlaySection>
        <PlayIconStyled />
        <PlaysCount>{formatNumber(realPlayCount)}</PlaysCount>
      </PlaySection>

      <RightSection>
        {!isGuestMode && (
          <HeartContainer
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
            onClick={handleHeartClick}
          >
            {liked ? (
              isHeartHovered ? (
                <BrokenHeartIconStyled />
              ) : (
                <FilledHeartIconStyled />
              )
            ) : (
              <HeartIconStyled />
            )}
          </HeartContainer>
        )}

        <MenuContainer>
          <DotsIconStyled onClick={handleToggleMenu} tabIndex={0} />
          {showMenu && (
            <DropdownMenu>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={(e) => handleMenuItemClick(item.action, () => {}, e)}
                  $isDelete={item.action === "removeFromPlaylist"}
                >
                  {item.action === "song" && <MusicIconStyled />}{" "}
                  {item.action === "playlist" && <AddPlaylistIconStyled />}
                  {item.action === "artist" && <ArtistIconStyled />}
                  {item.action === "album" && <AlbumIconStyled />}
                  {item.action === "removeFromPlaylist" && <DeleteIconStyled />}
                  <MenuText>{item.label}</MenuText>
                </MenuItem>
              ))}
            </DropdownMenu>
          )}
        </MenuContainer>
      </RightSection>

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        songId={id}
        songName={name}
      />
    </Container>
  );
};

const SongName = styled.div`
  font-size: 20px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s ease;
  display: inline-block;
  width: fit-content;
  max-width: 100%;

  &:hover {
    color: #ff4343;
    text-decoration: underline;
  }

  ${({ $isPlaying }) =>
    $isPlaying &&
    `
    color: #ff4343;
  `}
`;

const Container = styled.div`
  width: 723px;
  height: 68px;
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 12px;
  transition: all 0.18s;
  padding: 0 18px 0 0;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;

  ${({ $isPlaying }) =>
    $isPlaying &&
    `
    padding-left: 50px;
  `}

  &:hover {
    background: #191919;
  }
`;

const PlayingIndicator = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: all 0.2s ease;
  z-index: 2;
`;

const SongImg = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 18px;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  width: 270px;
  overflow: hidden;
`;

const SongArtist = styled.div`
  font-size: 16px;
  color: #a2a2a2;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4343;
    text-decoration: underline;
  }
`;

const SongDuration = styled.div`
  font-size: 16px;
  color: #fff;
  margin-top: 2px;
`;

const PlaySection = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 120px;

  ${Container} & {
    right: calc(290px + max(0px, (100% - 723px) * 0.3));
  }
`;

const PlaysCount = styled.div`
  font-size: 18px;
  color: #fff;
  text-align: left;
  min-width: 45px; /* ✅ Reduce from 60px to 45px */
  white-space: nowrap;
  margin-left: 8px; /* ✅ Add small margin to create consistent spacing from icon */
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.18s;
  pointer-events: none;

  ${Container}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`;

const HeartContainer = styled.span`
  display: inline-flex;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: -18px;
  background: #191919;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10;
  min-width: 200px;
  padding: 8px 0;
  margin-top: 8px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -16px;
    left: 0;
    right: 0;
    height: 20px;
    background: transparent;
  }

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    right: 24px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #191919;
    z-index: 1;
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $isDelete }) => ($isDelete ? "#ff4343" : "#fff")};

  &:hover {
    background: ${({ $isDelete }) => ($isDelete ? "#ff4343" : "#333")};
    color: ${({ $isDelete }) => ($isDelete ? "#fff" : "#fff")};
  }

  ${({ $isDelete }) =>
    $isDelete &&
    `
    &:hover {
      color: #fff;
    }
  `}
`;

const DeleteIconStyled = styled(DeleteIcon)`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;

const MenuText = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;
`;

export default Song;

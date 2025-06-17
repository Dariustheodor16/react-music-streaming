import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PlayIcon from "../../../assets/icons/play.svg?react";
import PauseIcon from "../../../assets/icons/pause.svg?react";
import { useAudio } from "../../../services/AudioContext";
import { useLikes } from "../../../services/LikeContext";
import { useState } from "react";
import {
  HeartIconStyled,
  FilledHeartIconStyled,
  BrokenHeartIconStyled,
} from "../../ui/Icons/SongIcons";

const Playlist = ({
  id,
  image,
  name,
  type,
  artist,
  tracks = [],
  showGrid = false,
  gridImages = [],
  onPlay,
  onViewMore,
  onArtistClick,
}) => {
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, pauseSong, togglePlayPause } =
    useAudio();
  const { isLiked, toggleLike } = useLikes();
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  const displayTracks = tracks;
  const liked = isLiked(id, "album");

  const isAlbumPlaying =
    tracks.some((track) => currentSong?.id === track.id) && isPlaying;

  const showHeartButton = type?.toLowerCase() !== "playlist";

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleLike(id, "album");
  };

  const handleAlbumNameClick = (e) => {
    e.stopPropagation();

    if (type?.toLowerCase() === "album" || type?.toLowerCase() === "ep") {
      navigate(`/album/${id}`);
    } else if (type?.toLowerCase() === "playlist") {
      if (
        id === "fresh-finds-playlist" ||
        id.startsWith("fresh-finds-") ||
        id.startsWith("trending-") ||
        id.startsWith("following-mix-") ||
        id.includes("fresh-") ||
        id.includes("trending") ||
        id.includes("following")
      ) {
        const tempPlaylist = {
          id: id,
          name: name,
          type: type,
          artist: artist,
          tracks: tracks.map((track) => ({
            id: track.id,
            title: track.title,
            artists: track.artists || [track.artist || "Unknown Artist"],
            artist: track.artists
              ? track.artists.join(", ")
              : track.artist || "Unknown Artist",
            audioUrl: track.audioUrl,
            duration: track.duration,
            genre: track.genre,
            imageUrl: track.imageUrl || image,
          })),
        };

        navigate(`/playlist/${id}`, {
          state: {
            playlist: tempPlaylist,
            isTemporary: true,
          },
        });
      } else {
        navigate(`/playlist/${id}`);
      }
    }
  };

  const handleTrackClick = (track, e) => {
    e.preventDefault();
    if (!track.audioUrl) return;

    if (currentSong?.id === track.id && isPlaying) {
      pauseSong();
      return;
    }

    const songData = {
      id: track.id,
      name: track.title,
      artist: track.artists ? track.artists.join(", ") : artist,
      image: track.imageUrl || image,
      audioUrl: track.audioUrl,
      duration: track.duration || "--:--",
      genre: track.genre,
      description: track.description,
    };

    const albumQueue = tracks
      .filter((t) => t.audioUrl)
      .map((t) => ({
        id: t.id,
        name: t.title,
        artist: t.artists ? t.artists.join(", ") : artist,
        image: t.imageUrl || image,
        audioUrl: t.audioUrl,
        duration: t.duration || "--:--",
        genre: t.genre,
        description: t.description,
      }));

    playSong(songData, albumQueue);
  };

  const handleAlbumPlay = () => {
    if (tracks.length === 0 || !tracks[0].audioUrl) return;
    if (isAlbumPlaying) {
      pauseSong();
      return;
    }
    if (tracks.some((track) => currentSong?.id === track.id) && !isPlaying) {
      togglePlayPause();
      return;
    }
    handleTrackClick(tracks[0], { preventDefault: () => {} });
  };

  const handleViewMore = () => {
    if (type?.toLowerCase() === "album" || type?.toLowerCase() === "ep") {
      navigate(`/album/${id}`);
    } else {
      if (onViewMore) {
        onViewMore();
      } else {
        if (
          id === "fresh-finds-playlist" ||
          id.startsWith("fresh-finds-") ||
          id.startsWith("trending-") ||
          id.startsWith("following-mix-") ||
          id.includes("fresh-") ||
          id.includes("trending") ||
          id.includes("following")
        ) {
          const tempPlaylist = {
            id: id,
            name: name,
            type: type,
            artist: artist,
            tracks: tracks.map((track) => ({
              id: track.id,
              title: track.title,
              artists: track.artists || [track.artist || "Unknown Artist"],
              artist: track.artists
                ? track.artists.join(", ")
                : track.artist || "Unknown Artist",
              audioUrl: track.audioUrl,
              duration: track.duration,
              genre: track.genre,
              imageUrl: track.imageUrl || image,
            })),
          };

          navigate(`/playlist/${id}`, {
            state: {
              playlist: tempPlaylist,
              isTemporary: true,
            },
          });
        } else {
          navigate(`/playlist/${id}`);
        }
      }
    }
  };

  if (!tracks.length || !name || !artist) {
    return null;
  }

  return (
    <Card className="playlist-card">
      <Left>
        {showGrid && gridImages.length >= 4 ? (
          <GridContainer>
            {gridImages.map((img, index) => (
              <GridItem
                key={index}
                src={img}
                alt={`${name} - Song ${index + 1}`}
                onError={(e) => {
                  console.log(`Grid image ${index} failed:`, img);
                  e.target.src = "/mini-logo.svg";
                }}
              />
            ))}
          </GridContainer>
        ) : (
          <Cover
            src={image}
            alt={name}
            onError={(e) => {
              console.log("Single image failed:", image);
              e.target.src = "/mini-logo.svg";
            }}
          />
        )}

        <Title
          $isClickable={
            type?.toLowerCase() === "album" ||
            type?.toLowerCase() === "ep" ||
            type?.toLowerCase() === "playlist"
          }
          onClick={handleAlbumNameClick}
        >
          {name}
        </Title>

        <Meta>
          <TypeText>
            {(() => {
              const typeValue = type?.toLowerCase();
              if (typeValue === "album") return "Album";
              if (typeValue === "ep") return "EP";
              return "Playlist";
            })()}
          </TypeText>
          <DotText>•</DotText>
          <ArtistAnchor
            href="#"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (onArtistClick) {
                onArtistClick();
              } else {
                console.log("Navigate to artist:", artist);
              }
            }}
            title={artist}
          >
            {artist.length > 22 ? artist.slice(0, 22) + "..." : artist}
          </ArtistAnchor>
        </Meta>
      </Left>
      <Right className="right-section">
        <SongListBlock>
          <SongList>
            {displayTracks.slice(0, 5).map((track, i) => (
              <SongRow key={track.id || i}>
                <SongMeta>
                  <SongLeft>
                    <SongNum>{i + 1}</SongNum>
                    <SongName
                      as="a"
                      href="#"
                      title={track.title}
                      tabIndex={0}
                      onClick={(e) => handleTrackClick(track, e)}
                      $isPlaying={currentSong?.id === track.id && isPlaying}
                    >
                      {track.title}
                    </SongName>
                    <PlayIndicator $isPlaying={currentSong?.id === track.id} />
                  </SongLeft>
                </SongMeta>
              </SongRow>
            ))}
          </SongList>
          {tracks.length > 5 && (
            <ViewMore onClick={handleViewMore}>
              View more tracks ({tracks.length - 5} more)
            </ViewMore>
          )}
        </SongListBlock>
        <PlayButton
          className="play-button"
          onClick={handleAlbumPlay}
          $isPlaying={isAlbumPlaying}
        >
          {isAlbumPlaying ? <PauseIcon /> : <PlayIcon />}
        </PlayButton>
        {showHeartButton && (
          <HeartButton
            className="heart-button"
            onClick={handleHeartClick}
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
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
          </HeartButton>
        )}
      </Right>
    </Card>
  );
};

const GridContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 100px 100px;
  gap: 0;
  background: #232323;
  box-sizing: border-box;
`;

const GridItem = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  background: #232323;
  display: block;
  border: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 248px;
  height: 292px;
  background: #191919;
  border-radius: 18px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  position: relative;
  transition: width 0.3s ease;
  cursor: pointer;

  &:hover {
    width: 450px;
  }
`;

const Right = styled.div`
  flex: 1;
  padding: 24px 20px 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }
`;

const Left = styled.div`
  width: 200px;
  padding: 24px 0 0 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;

  > * {
    flex-shrink: 0;
  }
`;

const Cover = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  background: #232323;
`;

const Title = styled.div`
  margin-top: 6px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  transition: color 0.2s ease;

  ${({ $isClickable }) =>
    $isClickable &&
    `
    &:hover {
      color: #ff4343;
    }
  `}
`;

const Meta = styled.div`
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TypeText = styled.span`
  color: #a2a2a2;
  font-weight: 400;
  font-size: 14px;
`;

const DotText = styled.span`
  color: #a2a2a2;
  font-size: 18px;
  margin: 0 4px;
`;

const ArtistAnchor = styled.a`
  color: #a2a2a2;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  font-weight: 400;

  &:hover {
    text-decoration: underline;
    color: #ff4343;
  }
`;

const SongListBlock = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SongList = styled.div`
  min-height: 0;
  margin-bottom: 0;
`;

const SongRow = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 6px 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 67, 67, 0.08);
    border-color: rgba(255, 67, 67, 0.2);
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 6px;
  }
`;

const SongMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SongLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  max-width: 140px;
`;

const SongNum = styled.span`
  font-size: 11px;
  color: #ff4343;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 67, 67, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${SongRow}:hover & {
    background: rgba(255, 67, 67, 0.25);
    color: #fff;
  }
`;

const SongName = styled.a`
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  font-weight: ${({ $isPlaying }) => ($isPlaying ? "600" : "400")};
  flex: 1;
  min-width: 0;
  max-width: 100px;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4343;
  }

  ${({ $isPlaying }) =>
    $isPlaying &&
    `
    color: #ff4343;
  `}
`;

const PlayIndicator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff4343;
  margin-left: 8px;
  opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 25px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;

  svg {
    width: 48px;
    height: 48px;
    fill: #ff4343;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }

  &:active svg {
    transform: scale(1.05);
  }

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeartButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 90px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(2px);
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ViewMore = styled.a`
  font-size: 12px;
  color: #a2a2a2;
  text-decoration: none;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    color: #ff4343;
    text-decoration: underline;
  }
`;

export default Playlist;

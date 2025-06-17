import { useState, useEffect } from "react";
import { useLikes } from "../../../services/LikeContext";
import { useAudio } from "../../../services/AudioContext";
import { useColorExtraction } from "../../../hooks/profile-hooks/useColorExtraction";
import EmptyPlayIcon from "../../../assets/icons/play.svg?react";
import PauseIcon from "../../../assets/icons/pause.svg?react";
import PlayIcon from "../../../assets/icons/mini-play.svg?react";
import {
  HeartIconStyled,
  FilledHeartIconStyled,
  BrokenHeartIconStyled,
} from "../../ui/Icons/SongIcons";
import { formatNumber } from "../../../utils/formatNumbers";
import styled from "styled-components";

const SongBanner = ({ song, playCount }) => {
  const { isLiked, toggleLike, getLikeCount } = useLikes();
  const { playSong, isPlaying, currentSong, pauseSong, togglePlayPause } =
    useAudio();
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const liked = isLiked(song.id, "song");

  const getSongImage = () => {
    if (
      song.imageUrl &&
      song.imageUrl.trim() !== "" &&
      song.imageUrl !== "/mini-logo.svg" &&
      song.imageUrl.startsWith("http")
    ) {
      return song.imageUrl;
    }
    return null;
  };

  const actualSongImage = getSongImage();
  const shouldExtractColors = actualSongImage && imageLoaded;
  const { gradient, imgRef } = useColorExtraction(
    shouldExtractColors ? actualSongImage : null
  );

  useEffect(() => {
    const loadLikeCount = async () => {
      if (song?.id) {
        const count = await getLikeCount(song.id, "song");
        setLikeCount(count);
      }
    };

    loadLikeCount();
  }, [song?.id, getLikeCount]);

  useEffect(() => {
    const updateLikeCount = async () => {
      if (song?.id) {
        const count = await getLikeCount(song.id, "song");
        setLikeCount(count);
      }
    };

    updateLikeCount();
  }, [liked, song?.id, getLikeCount]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const isCurrentSongPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlay = () => {
    if (!song.audioUrl) return;

    if (currentSong?.id === song.id) {
      togglePlayPause();
      return;
    }

    const songData = {
      id: song.id,
      name: song.title,
      artist: song.artists ? song.artists.join(", ") : "Unknown Artist",
      image: song.imageUrl,
      audioUrl: song.audioUrl,
      duration: song.duration || "--:--",
      genre: song.genre,
      description: song.description,
    };

    playSong(songData, [songData]);
  };

  const handleHeartClick = async () => {
    await toggleLike(song.id, "song");
  };

  return (
    <Banner style={gradient ? { background: gradient } : undefined}>
      {actualSongImage ? (
        <SongCover
          src={actualSongImage}
          alt={song.title}
          crossOrigin="anonymous"
          ref={imgRef}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <SongCoverFallback>
          {song.title ? song.title[0].toUpperCase() : "S"}
        </SongCoverFallback>
      )}

      <SongInfo>
        <SongName>{song.title}</SongName>
        <ArtistName>
          by {song.artists ? song.artists.join(", ") : "Unknown Artist"}
        </ArtistName>
        <SongDescription>
          {song.description || "No description available"}
        </SongDescription>
        <PlayCountSection>
          <PlayIcon />
          <PlayCountText>{playCount} plays</PlayCountText>
        </PlayCountSection>
      </SongInfo>

      <RightSection>
        <LikeSection>
          <HeartButton
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
          <LikeCount>{formatNumber(likeCount)}</LikeCount>{" "}
        </LikeSection>

        <PlaySection>
          <Duration>{song.duration || "--:--"}</Duration>
          <PlayButton onClick={handlePlay}>
            {isCurrentSongPlaying ? <PauseIcon /> : <EmptyPlayIcon />}
          </PlayButton>
        </PlaySection>
      </RightSection>
    </Banner>
  );
};

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
    background: linear-gradient(135deg, #444 0%, #222 100%);
  `}
`;

const SongCover = styled.img`
  width: 357px;
  height: 357px;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SongCoverFallback = styled.div`
  width: 357px;
  height: 357px;
  border-radius: 24px;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 128px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SongInfo = styled.div`
  flex: 1;
  padding: 0 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SongName = styled.h1`
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
`;

const ArtistName = styled.h2`
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 24px 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const SongDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 24px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  max-width: 400px;
`;

const PlayCountSection = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 28px;
    height: 35px;
    fill: rgba(255, 255, 255, 0.9);
    transform: translateX(-9px);
  }
`;

const PlayCountText = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 357px;
  padding: 24px 0;
`;

const LikeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg {
    width: 55px;
    height: 49px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const LikeCount = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
`;

export default SongBanner;

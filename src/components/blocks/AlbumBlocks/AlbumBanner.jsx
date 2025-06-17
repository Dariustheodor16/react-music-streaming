import { useState, useEffect } from "react";
import { useLikes } from "../../../services/LikeContext";
import { useAudio } from "../../../services/AudioContext";
import { useColorExtraction } from "../../../hooks/profile-hooks/useColorExtraction";
import EmptyPlayIcon from "../../../assets/icons/play.svg?react";
import PauseIcon from "../../../assets/icons/pause.svg?react";
import {
  HeartIconStyled,
  FilledHeartIconStyled,
  BrokenHeartIconStyled,
} from "../../ui/Icons/SongIcons";
import { formatNumber } from "../../../utils/formatNumbers";
import styled from "styled-components";

const AlbumBanner = ({ album, tracks }) => {
  const { isLiked, toggleLike, getLikeCount } = useLikes();
  const { playSong, isPlaying, currentSong, pauseSong, togglePlayPause } =
    useAudio();
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const liked = isLiked(album.id, "album");

  const getAlbumImage = () => {
    if (
      album.imageUrl &&
      album.imageUrl.trim() !== "" &&
      album.imageUrl !== "/mini-logo.svg" &&
      album.imageUrl.startsWith("http")
    ) {
      return album.imageUrl;
    }
    return null;
  };

  const actualAlbumImage = getAlbumImage();
  const shouldExtractColors = actualAlbumImage && imageLoaded;
  const { gradient, imgRef } = useColorExtraction(
    shouldExtractColors ? actualAlbumImage : null
  );

  useEffect(() => {
    const loadLikeCount = async () => {
      if (album?.id) {
        const count = await getLikeCount(album.id, "album");
        setLikeCount(count);
      }
    };

    loadLikeCount();
  }, [album?.id, getLikeCount]);

  useEffect(() => {
    const updateLikeCount = async () => {
      if (album?.id) {
        const count = await getLikeCount(album.id, "album");
        setLikeCount(count);
      }
    };

    updateLikeCount();
  }, [liked, album?.id, getLikeCount]);

  const totalDuration = tracks.reduce((total, track) => {
    if (track.duration && track.duration !== "--:--") {
      const [minutes, seconds] = track.duration.split(":").map(Number);
      return total + minutes * 60 + seconds;
    }
    return total;
  }, 0);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const isAlbumPlaying =
    tracks.some((track) => currentSong?.id === track.id) && isPlaying;

  const handlePlay = () => {
    if (!tracks.length || !tracks[0].audioUrl) return;

    if (isAlbumPlaying) {
      pauseSong();
      return;
    }

    if (tracks.some((track) => currentSong?.id === track.id) && !isPlaying) {
      togglePlayPause();
      return;
    }

    const firstTrack = tracks[0];
    const songData = {
      id: firstTrack.id,
      name: firstTrack.title,
      artist: firstTrack.artists ? firstTrack.artists.join(", ") : album.artist,
      image: album.imageUrl,
      audioUrl: firstTrack.audioUrl,
      duration: firstTrack.duration || "--:--",
      genre: firstTrack.genre,
      description: firstTrack.description,
    };

    const albumQueue = tracks
      .filter((t) => t.audioUrl)
      .map((t) => ({
        id: t.id,
        name: t.title,
        artist: t.artists ? t.artists.join(", ") : album.artist,
        image: album.imageUrl,
        audioUrl: t.audioUrl,
        duration: t.duration || "--:--",
        genre: t.genre,
        description: t.description,
      }));

    playSong(songData, albumQueue);
  };

  const handleHeartClick = async () => {
    await toggleLike(album.id, "album");
  };

  return (
    <Banner style={gradient ? { background: gradient } : undefined}>
      {actualAlbumImage ? (
        <AlbumCover
          src={actualAlbumImage}
          alt={album.name}
          crossOrigin="anonymous"
          ref={imgRef}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <AlbumCoverFallback>
          {album.name ? album.name[0].toUpperCase() : "A"}
        </AlbumCoverFallback>
      )}

      <AlbumInfo>
        <AlbumName>{album.name}</AlbumName>
        <ArtistName>
          by {album.artists ? album.artists.join(", ") : album.artist}
        </ArtistName>
        <AlbumDescription>
          {album.description || "No description available"}
        </AlbumDescription>
        <SongCount>{formatNumber(tracks.length)} Songs</SongCount>
      </AlbumInfo>

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
          <LikeCount>{formatNumber(likeCount)}</LikeCount>
        </LikeSection>

        <PlaySection>
          <Duration>{formatDuration(totalDuration)}</Duration>
          <PlayButton onClick={handlePlay}>
            {isAlbumPlaying ? <PauseIcon /> : <EmptyPlayIcon />}
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
    background: linear-gradient(120deg, rgb(27, 35, 27) 0%, rgb(195, 226, 201) 100%);
  `}
`;

const AlbumCover = styled.img`
  width: 357px;
  height: 357px;
  border-radius: 18px;
  object-fit: cover;
  background: #232323;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const AlbumCoverFallback = styled.div`
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

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 48px;
  flex: 1;
  color: #fff;
`;

const AlbumName = styled.h1`
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
`;

const ArtistName = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const AlbumDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 24px 0;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  max-width: 400px;
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

export default AlbumBanner;

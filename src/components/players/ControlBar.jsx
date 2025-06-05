import styled, { keyframes } from "styled-components";
import { useAudio } from "../../services/audioContext.jsx";
import { useEffect, useState, useRef } from "react";
import {
  useLikeState,
  useDragging,
  useVolumeControl,
  useProgressControl,
  useControlBarVisibility,
  useTimeFormatter,
} from "../../hooks/song-control-hooks";
import {
  SwitchIconStyled,
  SwitchIconFlipped,
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  HeartIcon,
  FilledHeartIconStyled,
  BrokenHeartIconStyled,
  AddPlaylistIcon,
  ShuffleIcon,
  VolumeIconStyled,
  VolumeMutedIconStyled,
} from "../../components/ui/Icons/ControlBarIcons";

const ControlBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
    volume,
    setVolume,
    playNext,
    playPrevious,
  } = useAudio();

  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const titleRef = useRef(null);
  const artistRef = useRef(null);

  const { isVisible } = useControlBarVisibility(currentSong);
  const { formatTime } = useTimeFormatter();
  const {
    liked,
    brokenHover,
    handleHeartClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useLikeState();
  const { toggleMute, calculateVolumeFromEvent } = useVolumeControl(
    volume,
    setVolume
  );
  const { calculateProgressFromEvent, handleProgressClick } =
    useProgressControl(duration, seek);

  const {
    isDragging: isProgressDragging,
    handleMouseDown: handleProgressMouseDown,
  } = useDragging((e) => {
    if (!progressBarRef.current || !duration) return;
    const newTime = calculateProgressFromEvent(e, progressBarRef.current);
    seek(newTime);
  });

  const {
    isDragging: isVolumeDragging,
    handleMouseDown: handleVolumeMouseDown,
  } = useDragging((e) => {
    if (!volumeBarRef.current) return;
    const newVolume = calculateVolumeFromEvent(e, volumeBarRef.current);
    setVolume(newVolume);
  });

  const handleVolumeClick = (e) => {
    if (isVolumeDragging) return;
    const newVolume = calculateVolumeFromEvent(e, e.currentTarget);
    setVolume(newVolume);
  };

  const percent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = (volume || 0) * 100;

  const isTitleLong = currentSong?.name && currentSong.name.length > 20;
  const isArtistLong = currentSong?.artist && currentSong.artist.length > 20;

  const [titleScrollDistance, setTitleScrollDistance] = useState(0);
  const [artistScrollDistance, setArtistScrollDistance] = useState(0);

  useEffect(() => {
    if (!currentSong) return;

    const containerWidth = 135;

    if (isTitleLong && titleRef.current) {
      const titleWidth = titleRef.current.scrollWidth;
      const scrollDistance = titleWidth - containerWidth;
      setTitleScrollDistance(Math.max(0, scrollDistance));
    }

    if (isArtistLong && artistRef.current) {
      const artistWidth = artistRef.current.scrollWidth;
      const scrollDistance = artistWidth - containerWidth;
      setArtistScrollDistance(Math.max(0, scrollDistance));
    }
  }, [currentSong, isTitleLong, isArtistLong]);

  if (!currentSong) return null;

  return (
    <Bar $isVisible={isVisible}>
      <BarContent>
        <SongInfo>
          <SongImg src={currentSong.image || "/mini-logo.svg"} alt="cover" />
          <SongText>
            <SongTitle
              ref={titleRef}
              $isLong={isTitleLong}
              $scrollDistance={titleScrollDistance}
            >
              {currentSong.name || "Song name"}
            </SongTitle>
            <SongArtist
              ref={artistRef}
              $isLong={isArtistLong}
              $scrollDistance={artistScrollDistance}
            >
              {currentSong.artist || "Artist name"}
            </SongArtist>
          </SongText>
        </SongInfo>

        <CenterSection>
          <Controls>
            <IconButton>
              <ShuffleIcon />
            </IconButton>
            <IconButton onClick={playPrevious}>
              <SwitchIconStyled />
            </IconButton>
            <PlayButton onClick={togglePlayPause}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </PlayButton>
            <IconButton onClick={playNext}>
              <SwitchIconFlipped />
            </IconButton>
            <IconButton>
              <RepeatIcon />
            </IconButton>
          </Controls>

          <ProgressSection>
            <TimeText>{formatTime(currentTime)}</TimeText>
            <ProgressBar
              ref={progressBarRef}
              onClick={(e) => handleProgressClick(e, isProgressDragging)}
            >
              <ProgressTrack>
                <ProgressFill style={{ width: `${percent}%` }} />
                <ProgressCircle
                  style={{ left: `calc(${percent}% - 8px)` }}
                  onMouseDown={handleProgressMouseDown}
                  $isDragging={isProgressDragging}
                />
              </ProgressTrack>
            </ProgressBar>
            <TimeText>{formatTime(duration)}</TimeText>
          </ProgressSection>
        </CenterSection>

        <RightIcons>
          {!liked ? (
            <HeartButton onClick={handleHeartClick}>
              <HeartIcon />
            </HeartButton>
          ) : (
            <HeartContainer
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {!brokenHover ? (
                <HeartButton onClick={handleHeartClick}>
                  <FilledHeartIconStyled />
                </HeartButton>
              ) : (
                <HeartButton onClick={handleHeartClick}>
                  <BrokenHeartIconStyled />
                </HeartButton>
              )}
            </HeartContainer>
          )}
          <IconButton>
            <AddPlaylistIcon />
          </IconButton>
          <VolumeSection>
            {volume === 0 ? (
              <VolumeMutedIconStyled onClick={toggleMute} />
            ) : (
              <VolumeIconStyled onClick={toggleMute} />
            )}
            <VolumeSlider ref={volumeBarRef} onClick={handleVolumeClick}>
              <VolumeTrack>
                <VolumeFill style={{ width: `${volumePercent}%` }} />
                <VolumeCircle
                  style={{ left: `calc(${volumePercent}% - 6px)` }}
                  onMouseDown={handleVolumeMouseDown}
                  $isDragging={isVolumeDragging}
                />
              </VolumeTrack>
            </VolumeSlider>
          </VolumeSection>
        </RightIcons>
      </BarContent>
    </Bar>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const Bar = styled.div`
  width: 100vw;
  height: 70px;
  background: #191919;
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;

  animation: ${({ $isVisible }) => ($isVisible ? slideUp : slideDown)} 0.25s
    cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;

  box-shadow: 0 -4px 5px rgba(0, 0, 0, 0.3);

  backdrop-filter: blur(5px);
  background: rgba(25, 25, 25, 0.95);
`;

const BarContent = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 210px 1fr 280px;
  align-items: center;
  height: 70px;
  padding: 0 16px;
  box-sizing: border-box;
  gap: 12px;

  animation: fadeInUp 0.6s ease 0.2s both;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16px;
  width: 210px;
  overflow: hidden;

  animation: slideInLeft 0.5s ease 0.3s both;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const SongImg = styled.img`
  width: 57px;
  height: 57px;
  border-radius: 10px;
  object-fit: cover;
  background: #232323;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SongText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 140px;
  position: relative;
`;

const SongTitle = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  width: ${({ $isLong }) => ($isLong ? "auto" : "100%")};
  overflow: visible;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: ${({ $isLong, $scrollDistance }) =>
      $isLong ? `-${$scrollDistance}px` : "0px"};
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, transparent, #191919);
    z-index: 2;
    pointer-events: none;
  }

  ${({ $isLong, $scrollDistance }) =>
    $isLong
      ? `
    animation: backAndForthTitle 12s ease-in-out infinite;
    
    @keyframes backAndForthTitle {
      0%, 20% {
        transform: translateX(0);
      }
      45%, 55% {
        transform: translateX(-${$scrollDistance}px);
      }
      80%, 100% {
        transform: translateX(0);
      }
    }
  `
      : `
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

const SongArtist = styled.div`
  color: #d9d9d9;
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  width: ${({ $isLong }) => ($isLong ? "auto" : "100%")};
  overflow: visible;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: ${({ $isLong, $scrollDistance }) =>
      $isLong ? `-${$scrollDistance}px` : "0px"};
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, transparent, #191919);
    z-index: 2;
    pointer-events: none;
  }

  ${({ $isLong, $scrollDistance }) =>
    $isLong
      ? `
    animation: backAndForthArtist 12s ease-in-out infinite;
    animation-delay: 2s;
    
    @keyframes backAndForthArtist {
      0%, 20% {
        transform: translateX(0);
      }
      45%, 55% {
        transform: translateX(-${$scrollDistance}px);
      }
      80%, 100% {
        transform: translateX(0);
      }
    }
  `
      : `
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: center;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  animation: scaleIn 0.4s ease 0.4s both;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 500px;
  min-width: 350px;

  animation: slideInRight 0.5s ease 0.5s both;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const TimeText = styled.p`
  color: #d9d9d9;
  font-size: 14px;
  width: 44px;
  text-align: center;
  margin: 0;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #585858;
  border-radius: 3px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    height: 8px;
    background: #666;
  }
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 6px;
  background: #ff4343;
  border-radius: 3px;
  z-index: 1;
  transition: all 0.1s ease;
  pointer-events: none;
  ${ProgressTrack}:hover & {
    height: 8px;
  }
`;

const ProgressCircle = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: #ff4343;
  border-radius: 50%;
  z-index: 2;
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "all 0.2s ease")};
  box-shadow: 0 0 0 2px rgba(255, 67, 67, 0.2);
  pointer-events: auto;

  &:hover {
    transform: translateY(-50%) scale(1.2);
    box-shadow: 0 0 0 4px rgba(255, 67, 67, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(1.3);
    box-shadow: 0 0 0 6px rgba(255, 67, 67, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    cursor: inherit;
  }
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  animation: fadeInRight 0.4s ease 0.6s both;

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 50%;

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    transition: all 0.2s ease;
  }

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);

    svg {
      fill: #ff4343;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const HeartContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const VolumeSlider = styled.div`
  width: 80px;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const VolumeTrack = styled.div`
  width: 100%;
  height: 4px;
  background: #585858;
  border-radius: 2px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    height: 6px;
    background: #666;
  }
`;

const VolumeFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 4px;
  background: #ff4343;
  border-radius: 2px;
  z-index: 1;
  transition: all 0.1s ease;
  pointer-events: none;

  ${VolumeTrack}:hover & {
    height: 6px;
  }
`;

const VolumeCircle = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #ff4343;
  border-radius: 50%;
  z-index: 2;
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "all 0.2s ease")};
  box-shadow: 0 0 0 2px rgba(255, 67, 67, 0.2);
  pointer-events: auto;

  &:hover {
    transform: translateY(-50%) scale(1.3);
    box-shadow: 0 0 0 3px rgba(255, 67, 67, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(1.4);
    box-shadow: 0 0 0 4px rgba(255, 67, 67, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 50%;
    cursor: inherit;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? "#ff4343" : "#585858")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    fill: ${({ active }) => (active ? "#ff4343" : "#585858")};
    transition: all 0.2s ease;
  }

  &:hover {
    color: #ff4343;
    transform: scale(1.1);

    svg {
      fill: #ff4343;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PlayButton = styled(IconButton)`
  width: 50px;
  height: 50px;

  svg {
    width: 50px;
    height: 50px;
    fill: #fff;
  }

  &:hover {
    transform: scale(1.05);

    svg {
      fill: #ff4343;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default ControlBar;

import styled from "styled-components";
import SwitchIcon from "../../assets/icons/switch.svg?react";
import PlayIcon from "../../assets/icons/play.svg?react";
import RepeatIcon from "../../assets/icons/repeat.svg?react";
import HeartIcon from "../../assets/icons/empty-heart.svg?react";
import AddPlaylistIcon from "../../assets/icons/add-playlist.svg?react";
import ShuffleIcon from "../../assets/icons/shuffle.svg?react";

const ControlBar = ({
  song = {},
  player,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
  onSeek,
  isPlaying,
  isShuffling,
  isRepeating,
  currentTime = 0,
  duration = 0,
}) => {
  const formatTime = (t) => {
    const m = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Bar>
      <BarContent>
        <SongInfo>
          <SongImg src={song.imageUrl || "/mini-logo.svg"} alt="cover" />
          <SongText>
            <SongTitle>{song.title || "Song name"}</SongTitle>
            <SongArtist>{song.artist || "Artist name"}</SongArtist>
          </SongText>
        </SongInfo>
        <Controls>
          <IconButton onClick={onShuffle} active={isShuffling}>
            <ShuffleIcon />
          </IconButton>
          <IconButton onClick={onPrevious}>
            <SwitchIconStyled />
          </IconButton>
          <PlayButton onClick={onPlayPause}>
            <PlayIcon />
          </PlayButton>
          <IconButton onClick={onNext}>
            <SwitchIconFlipped />
          </IconButton>
          <IconButton onClick={onRepeat} active={isRepeating}>
            <RepeatIcon />
          </IconButton>
        </Controls>
        <ProgressSection>
          <TimeText>{formatTime(currentTime)}</TimeText>
          <ProgressBar>
            <ProgressTrack>
              <ProgressFill style={{ width: `${percent}%` }} />
              <ProgressCircle
                style={{ left: `calc(${percent}% - 8px)` }}
                tabIndex={0}
                aria-label="Seek"
                role="slider"
                aria-valuenow={currentTime}
                aria-valuemax={duration}
                aria-valuemin={0}
                onMouseDown={(e) => {
                  const bar = e.target.parentNode;
                  const rect = bar.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newTime = (x / rect.width) * duration;
                  if (onSeek) onSeek(newTime);
                }}
              />
            </ProgressTrack>
          </ProgressBar>
          <TimeText>{formatTime(duration)}</TimeText>
        </ProgressSection>
        <RightIcons>
          <IconButton>
            <HeartIcon />
          </IconButton>
          <IconButton>
            <AddPlaylistIcon />
          </IconButton>
        </RightIcons>
      </BarContent>
    </Bar>
  );
};

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
`;

const BarContent = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 16px;
  box-sizing: border-box;
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16px;
`;

const SongImg = styled.img`
  width: 57px;
  height: 57px;
  border-radius: 10px;
  object-fit: cover;
  background: #232323;
`;

const SongText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const SongTitle = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.div`
  color: #d9d9d9;
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? "#ff4343" : "#585858")};
  display: flex;
  align-items: center;
  svg {
    fill: ${({ active }) => (active ? "#ff4343" : "#585858")};
  }
`;

const PlayButton = styled(IconButton)`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
    height: 50px;
    fill: #fff;
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  flex: 1;
  max-width: 400px;
  margin: 0 32px;
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
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #585858;
  border-radius: 3px;
  position: relative;
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 6px;
  background: #ff4343;
  border-radius: 3px;
  z-index: 1;
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
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 2px rgba(255, 67, 67, 0.2);
`;

const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const SwitchIconStyled = styled(SwitchIcon)`
  width: 23.5px;
  height: 23.5px;
`;

const SwitchIconFlipped = styled(SwitchIconStyled)`
  transform: scaleX(-1);
`;

export default ControlBar;

import styled from "styled-components";
import { useAudio } from "../../../services/audioContext.jsx";
import {
  useLikeState,
  useDropdownMenu,
  useSongs,
} from "../../../hooks/song-control-hooks";
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
} from "../../../components/ui/Icons/SongIcons";

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
}) => {
  const { currentSong, isPlaying, playSong, pauseSong } = useAudio();
  const {
    liked,
    brokenHover,
    handleHeartClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useLikeState();
  const { showMenu, handleToggleMenu, handleCloseMenu, handleMenuItemClick } =
    useDropdownMenu();

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

  const isCurrentSong = currentSong?.id === id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  return (
    <Container
      onClick={handleSongClick}
      $isPlaying={isCurrentlyPlaying}
      onMouseLeave={handleCloseMenu}
    >
      <PlayingIndicator $show={isCurrentlyPlaying}>
        <PlaySecondaryIconStyled />
      </PlayingIndicator>

      <SongImg src={image} alt={name} />
      <SongInfo>
        <SongName $isPlaying={isCurrentlyPlaying}>{name}</SongName>
        <SongArtist>{artist}</SongArtist>
        <SongDuration>{duration}</SongDuration>
      </SongInfo>

      <PlaySection>
        <PlayIconStyled />
        <Plays>{plays}</Plays>
      </PlaySection>

      <RightSection>
        {!liked ? (
          <HeartIconStyled
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleHeartClick();
            }}
          />
        ) : (
          <HeartContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
          >
            {!brokenHover ? (
              <FilledHeartIconStyled tabIndex={0} onClick={handleHeartClick} />
            ) : (
              <BrokenHeartIconStyled tabIndex={0} onClick={handleHeartClick} />
            )}
          </HeartContainer>
        )}

        <MenuContainer>
          <DotsIconStyled onClick={handleToggleMenu} tabIndex={0} />
          {showMenu && (
            <DropdownMenu>
              <MenuItem
                onClick={(e) =>
                  handleMenuItemClick("playlist", handleMenuAction, e)
                }
              >
                <AddPlaylistIconStyled />
                <MenuText>Add to playlist</MenuText>
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handleMenuItemClick("artist", handleMenuAction, e)
                }
              >
                <ArtistIconStyled />
                <MenuText>Go to artist</MenuText>
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handleMenuItemClick("album", handleMenuAction, e)
                }
              >
                <AlbumIconStyled />
                <MenuText>Go to album</MenuText>
              </MenuItem>
            </DropdownMenu>
          )}
        </MenuContainer>
      </RightSection>
    </Container>
  );
};

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
`;

const SongName = styled.div`
  font-size: 20px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongArtist = styled.div`
  font-size: 16px;
  color: #a2a2a2;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const Plays = styled.div`
  font-size: 18px;
  color: #fff;
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
`;

const MenuContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: -18px;
  background: #191919;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  min-width: 180px;
  padding: 8px 0;
  margin-top: 4px;

  &::after {
    content: "";
    position: absolute;
    top: -12px;
    left: 0;
    right: 0;
    height: 16px;
    background: transparent;
  }

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #191919;
    z-index: 1;
  }
`;

const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const MenuText = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  white-space: nowrap;
`;

export default Song;

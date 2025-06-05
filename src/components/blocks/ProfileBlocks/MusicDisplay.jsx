import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Playlist from "../MusicBlocks/Playlist";
import Song from "../MusicBlocks/Song";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { useAuth } from "../../../services/authContext";
import {
  useSongs,
  useTabs,
  useMusicDisplayLogic,
} from "../../../hooks/song-control-hooks";

const TABS = [
  { label: "Everything", value: "everything" },
  { label: "Songs", value: "songs" },
  { label: "Albums", value: "albums" },
];

const MusicDisplay = ({ userId = null, isOwnProfile = true }) => {
  const { currentUser } = useAuth();
  const targetUserId = userId || currentUser?.uid;
  const navigate = useNavigate();

  const { songs, loading, error } = useSongs(targetUserId);
  const { activeTab, changeTab } = useTabs("everything");

  // Mock playlists for now
  const playlists = [{ name: "Album 1" }];

  const { useSideLayout, showEmptyState } = useMusicDisplayLogic(
    songs,
    playlists,
    activeTab
  );

  const handleUploadClick = () => {
    navigate("/upload");
  };

  if (loading) {
    return (
      <Wrapper>
        <Tabs>
          {TABS.map((tab) => (
            <TabButton
              key={tab.value}
              $active={activeTab === tab.value}
              onClick={() => changeTab(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </Tabs>
        <LoadingState>
          <LoadingMessage>Loading your music...</LoadingMessage>
        </LoadingState>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <ErrorState>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorState>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Tabs>
        {TABS.map((tab) => (
          <TabButton
            key={tab.value}
            $active={activeTab === tab.value}
            onClick={() => changeTab(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </Tabs>

      {showEmptyState ? (
        <EmptyState>
          <EmptyMessage>
            Crickets... 🦗 No music yet—drop a beat and change that!
          </EmptyMessage>
          <PrimaryButton onClick={handleUploadClick}>Upload Now</PrimaryButton>
        </EmptyState>
      ) : activeTab === "songs" ? (
        <SongsOnlyGrid>
          {songs.map((song, i) => (
            <SongItemWide key={song.id || i}>
              <Song
                id={song.id}
                name={song.name}
                artist={song.artist}
                duration={song.duration}
                plays={song.plays}
                image={song.image}
                audioUrl={song.audioUrl}
                genre={song.genre}
                description={song.description}
                allSongs={songs}
              />
            </SongItemWide>
          ))}
        </SongsOnlyGrid>
      ) : activeTab === "albums" ? (
        <AlbumsOnlyGrid>
          {playlists.map((playlist, i) => (
            <Playlist key={i} {...playlist} />
          ))}
        </AlbumsOnlyGrid>
      ) : playlists.length === 0 ? (
        <SongsOnlyGrid>
          {songs.map((song, i) => (
            <SongItemWide key={song.id || i}>
              <Song {...song} allSongs={songs} />
            </SongItemWide>
          ))}
        </SongsOnlyGrid>
      ) : useSideLayout ? (
        <Container>
          <Left>
            {playlists.map((playlist, i) => (
              <Playlist key={i} {...playlist} />
            ))}
          </Left>
          <Right>
            {songs.map((song, i) => (
              <SongItemMedium key={song.id || i}>
                <Song {...song} allSongs={songs} />
              </SongItemMedium>
            ))}
          </Right>
          <EmptySpace />
        </Container>
      ) : (
        <EverythingGrid>
          {playlists.map((playlist, i) => (
            <PlaylistItem key={`playlist-${i}`}>
              <Playlist {...playlist} />
            </PlaylistItem>
          ))}
          {songs.map((song, i) => (
            <SongItemWide key={`song-${song.id || i}`}>
              <Song {...song} allSongs={songs} />
            </SongItemWide>
          ))}
        </EverythingGrid>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  max-width: 1190px;
  padding-top: 12px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Tabs = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  margin-left: 8px;
  margin-top: 0;
`;

const TabButton = styled.button`
  background: ${({ $active }) => ($active ? "#ff4343" : "none")};
  border: none;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 32px;
  height: 42px;
  min-width: 192px;
  border-radius: 12px;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:hover {
    color: ${({ $active }) => ($active ? "#fff" : "#ff4343")};
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const LoadingMessage = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
  max-width: 600px;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid #ff4343;
  border-radius: 8px;
  padding: 20px;
  color: #ff4343;
  text-align: center;
  max-width: 400px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const EmptyMessage = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
  max-width: 600px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 34px;
  gap: 24px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const EmptySpace = styled.div`
  flex: 1;
`;

const EverythingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
`;

const PlaylistItem = styled.div``;

const SongItemWide = styled.div`
  grid-column: 1 / -1;
  width: 100%;

  > div {
    width: 100% !important;
    max-width: 1190px !important;
  }
`;

const SongItemMedium = styled.div`
  width: 100%;
`;

const SongsOnlyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const AlbumsOnlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
`;

export default MusicDisplay;

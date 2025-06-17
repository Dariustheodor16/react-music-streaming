import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Playlist from "../MusicBlocks/Playlist";
import Song from "../MusicBlocks/Song";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { useAuth } from "../../../services/auth/AuthContext";
import { useAlbums } from "../../../hooks/profile-hooks/useAlbums";
import {
  useSongs,
  useTabs,
  useMusicDisplayLogic,
} from "../../../hooks/song-control-hooks";
import { useSongsCount } from "../../../hooks/profile-hooks/useSongsCount";
import { useAlbumsCount } from "../../../hooks/profile-hooks/useAlbumsCount";
import { useCallback, useState } from "react";

const TABS = [
  { label: "Everything", value: "everything" },
  { label: "Songs", value: "songs" },
  { label: "Albums", value: "albums" },
];

const MusicDisplay = ({ userId = null, isOwnProfile = true }) => {
  const { currentUser } = useAuth();
  const targetUserId = userId || currentUser?.uid;
  const navigate = useNavigate();
  const [songsRefreshKey, setSongsRefreshKey] = useState(0);
  const [albumsRefreshKey, setAlbumsRefreshKey] = useState(0);

  const {
    songs,
    loading: songsLoading,
    error: songsError,
    refetch: refetchSongs,
  } = useSongs(targetUserId, songsRefreshKey);

  const {
    albums,
    loading: albumsLoading,
    error: albumsError,
    refetch: refetchAlbums,
  } = useAlbums(targetUserId, albumsRefreshKey);

  const { refetch: refetchSongsCount } = useSongsCount(targetUserId);
  const { refetch: refetchAlbumsCount } = useAlbumsCount(targetUserId);

  const { activeTab, changeTab } = useTabs("everything");
  const loading = songsLoading || albumsLoading;
  const error = songsError || albumsError;

  const { useSideLayout, showEmptyState } = useMusicDisplayLogic(
    songs,
    albums,
    activeTab
  );

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const renderSkeletonContent = () => {
    if (activeTab === "songs") {
      return (
        <SongsOnlyGrid>
          {[1, 2, 3, 4, 5].map((i) => (
            <SongItemWide key={i}>
              <SkeletonSong>
                <SkeletonSongImage>
                  <SkeletonShimmer />
                </SkeletonSongImage>
                <SkeletonSongInfo>
                  <SkeletonSongTitle>
                    <SkeletonShimmer />
                  </SkeletonSongTitle>
                  <SkeletonSongArtist>
                    <SkeletonShimmer />
                  </SkeletonSongArtist>
                </SkeletonSongInfo>
              </SkeletonSong>
            </SongItemWide>
          ))}
        </SongsOnlyGrid>
      );
    } else if (activeTab === "albums") {
      return (
        <AlbumsOnlyGrid>
          {[1, 2, 3].map((i) => (
            <SkeletonAlbum key={i}>
              <SkeletonAlbumCover>
                <SkeletonShimmer />
              </SkeletonAlbumCover>
              <SkeletonAlbumTitle>
                <SkeletonShimmer />
              </SkeletonAlbumTitle>
              <SkeletonAlbumMeta>
                <SkeletonShimmer />
              </SkeletonAlbumMeta>
            </SkeletonAlbum>
          ))}
        </AlbumsOnlyGrid>
      );
    } else {
      return (
        <EverythingGrid>
          {[1, 2].map((i) => (
            <SkeletonAlbum key={`album-${i}`}>
              <SkeletonAlbumCover>
                <SkeletonShimmer />
              </SkeletonAlbumCover>
              <SkeletonAlbumTitle>
                <SkeletonShimmer />
              </SkeletonAlbumTitle>
              <SkeletonAlbumMeta>
                <SkeletonShimmer />
              </SkeletonAlbumMeta>
            </SkeletonAlbum>
          ))}
          {[1, 2, 3].map((i) => (
            <SongItemWide key={`song-${i}`}>
              <SkeletonSong>
                <SkeletonSongImage>
                  <SkeletonShimmer />
                </SkeletonSongImage>
                <SkeletonSongInfo>
                  <SkeletonSongTitle>
                    <SkeletonShimmer />
                  </SkeletonSongTitle>
                  <SkeletonSongArtist>
                    <SkeletonShimmer />
                  </SkeletonSongArtist>
                </SkeletonSongInfo>
              </SkeletonSong>
            </SongItemWide>
          ))}
        </EverythingGrid>
      );
    }
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
        {renderSkeletonContent()}
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
          {isOwnProfile ? (
            <>
              <EmptyMessage>
                Crickets... 🦗 No music yet—drop a beat and change that!
              </EmptyMessage>
              <StyledUploadButton onClick={handleUploadClick}>
                Upload Now
              </StyledUploadButton>
            </>
          ) : (
            <EmptyMessage>
              This user hasn't uploaded any music yet. 🎵
            </EmptyMessage>
          )}
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
                albumId={song.albumId}
              />
            </SongItemWide>
          ))}
        </SongsOnlyGrid>
      ) : activeTab === "albums" ? (
        <AlbumsOnlyGrid>
          {albums.map((album, i) => (
            <Playlist
              key={album.id || i}
              id={album.id}
              image={album.image}
              name={album.name}
              type={album.type}
              artist={album.artist}
              tracks={album.tracks}
              onPlay={() => {
                console.log("Play album:", album.name);
              }}
              onViewMore={() => {
                console.log("View more tracks for:", album.name);
              }}
            />
          ))}
          {albums.length === 0 && (
            <EmptyState>
              {isOwnProfile ? (
                <>
                  <EmptyMessage>
                    No albums yet. Upload multiple songs to create an album! 💿
                  </EmptyMessage>
                  <StyledUploadButton onClick={handleUploadClick}>
                    Upload Now
                  </StyledUploadButton>
                </>
              ) : (
                <EmptyMessage>
                  This user hasn't uploaded any albums yet. 💿
                </EmptyMessage>
              )}
            </EmptyState>
          )}
        </AlbumsOnlyGrid>
      ) : albums.length === 0 ? (
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
            {albums.map((album, i) => (
              <Playlist
                key={album.id || i}
                id={album.id}
                image={album.image}
                name={album.name}
                type={album.type}
                artist={album.artist}
                tracks={album.tracks}
                onPlay={() => console.log("Play album:", album.name)}
                onViewMore={() => console.log("View album:", album.name)}
              />
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
        <EverythingGrid $albumCount={albums.length}>
          {albums.map((album, i) => (
            <Playlist
              key={`album-${album.id || i}`}
              id={album.id}
              image={album.image}
              name={album.name}
              type={album.type}
              artist={album.artist}
              tracks={album.tracks}
              onPlay={() => console.log("Play album:", album.name)}
              onViewMore={() => console.log("View album:", album.name)}
            />
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

const StyledUploadButton = styled(PrimaryButton)`
  width: 209px !important;
  height: 54px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
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
  grid-template-columns: ${({ $albumCount }) =>
    $albumCount >= 3 ? "repeat(3, 1fr)" : "repeat(4, 1fr)"};
  gap: 24px;
  width: 100%;
`;

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

const SkeletonShimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const SkeletonSong = styled.div`
  width: 100%;
  max-width: 723px;
  height: 68px;
  display: flex;
  align-items: center;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 0 18px;
  position: relative;
  overflow: hidden;
`;

const SkeletonSongImage = styled.div`
  width: 68px;
  height: 68px;
  background: #2a2a2a;
  border-radius: 12px;
  margin-right: 18px;
  position: relative;
  overflow: hidden;
`;

const SkeletonSongInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const SkeletonSongTitle = styled.div`
  width: 200px;
  height: 20px;
  background: #2a2a2a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const SkeletonSongArtist = styled.div`
  width: 150px;
  height: 16px;
  background: #2a2a2a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const SkeletonAlbum = styled.div`
  width: 248px;
  background: #1a1a1a;
  border-radius: 24px;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const SkeletonAlbumCover = styled.div`
  width: 200px;
  height: 200px;
  background: #2a2a2a;
  border-radius: 12px;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
`;

const SkeletonAlbumTitle = styled.div`
  width: 160px;
  height: 20px;
  background: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 5px;
  position: relative;
  overflow: hidden;
`;

const SkeletonAlbumMeta = styled.div`
  width: 120px;
  height: 14px;
  background: #2a2a2a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

export default MusicDisplay;

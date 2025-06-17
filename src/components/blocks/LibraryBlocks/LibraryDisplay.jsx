import { useState, useEffect, useRef } from "react";
import { useLikes } from "../../../services/LikeContext";
import { useAuth } from "../../../services/auth/AuthContext";
import {
  trackService,
  albumService,
  durationService,
  playlistService,
} from "../../../services/api";
import Song from "../MusicBlocks/Song";
import Playlist from "../MusicBlocks/Playlist";
import RightCircleIcon from "../../../assets/icons/right-circle.svg?react";
import styled from "styled-components";
import {
  Wrapper,
  Tabs,
  TabButton,
  LoadingState,
  LoadingMessage,
  EmptyState,
  EmptyMessage,
  SongsOnlyGrid,
  SongItemWide,
} from "./LibraryDisplayStyles";
import { LIBRARY_TABS } from "../../../constants/tabs";
import { usePlaylists } from "../../../hooks/profile-hooks/usePlaylists";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../../utils/formatNumbers";

const ExpandedPlaylist = styled(({ className, ...props }) => (
  <div className={className}>
    <Playlist {...props} />
  </div>
))`
  .playlist-card {
    width: 500px !important;

    .right-section {
      opacity: 1 !important;
      transform: translateX(0) !important;
      padding-left: 32px !important;
    }

    .heart-button,
    .play-button {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  }
`;

const LibraryDisplay = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [likedSongsData, setLikedSongsData] = useState([]);
  const [likedAlbumsData, setLikedAlbumsData] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { likedSongs, likedAlbums, loading: likesLoading } = useLikes();
  const { currentUser } = useAuth();
  const { playlists: userPlaylists, loading: playlistsLoading } = usePlaylists(
    currentUser?.uid
  );

  const albumsCarouselRef = useRef(null);
  const playlistsCarouselRef = useRef(null);
  const [canScrollAlbumsLeft, setCanScrollAlbumsLeft] = useState(false);
  const [canScrollAlbumsRight, setCanScrollAlbumsRight] = useState(false);
  const [canScrollPlaylistsLeft, setCanScrollPlaylistsLeft] = useState(false);
  const [canScrollPlaylistsRight, setCanScrollPlaylistsRight] = useState(false);

  const filterLikedSongs = (songs) => {
    return songs.filter((song) => likedSongs.has(song.id));
  };

  const filterLikedAlbums = (albums) => {
    return albums.filter((album) => likedAlbums.has(album.id));
  };
  useEffect(() => {
    if (!loading && !initialLoad) {
      setLikedSongsData((prevSongs) => filterLikedSongs(prevSongs));
      setLikedAlbumsData((prevAlbums) => filterLikedAlbums(prevAlbums));
    }
  }, [likedSongs, likedAlbums, loading, initialLoad]);

  useEffect(() => {
    const fetchData = async () => {
      if (likesLoading) return;

      setLoading(true);
      try {
        if (
          (activeTab === "likes" || activeTab === "browse") &&
          likedSongs.size > 0
        ) {
          const likedSongIds = Array.from(likedSongs);
          const tracks = await trackService.getTracksByIds(likedSongIds);
          const tracksWithDuration =
            await durationService.getMultipleTrackDurations(tracks);

          const songs = tracksWithDuration.map((track) => ({
            id: track.id,
            name: track.title,
            artist:
              track.artist ||
              (track.artists && track.artists.length > 0
                ? track.artists.join(", ")
                : "Unknown Artist"),
            duration: track.duration,
            plays: track.plays || Math.floor(Math.random() * 10000),
            image: track.imageUrl || "/mini-logo.svg",
            audioUrl: track.audioUrl,
            genre: track.genre,
            description: track.description,
            uploaderUsername: track.uploaderUsername,
          }));

          setLikedSongsData(songs);
        } else {
          setLikedSongsData([]);
        }
        if (
          (activeTab === "albums" || activeTab === "browse") &&
          likedAlbums.size > 0
        ) {
          const likedAlbumIds = Array.from(likedAlbums);
          const albums = await albumService.getAlbumsByIds(likedAlbumIds);

          const albumsWithTracks = await Promise.all(
            albums.map(async (album) => {
              const tracks = await trackService.getTracksByAlbumId(album.id);
              return {
                id: album.id,
                name: album.name,
                artist: album.artist,
                type: album.type,
                image: album.imageUrl,
                tracks: tracks
                  .map((track) => ({
                    id: track.id,
                    title: track.title,
                    artists: track.artists,
                    audioUrl: track.audioUrl,
                    genre: track.genre,
                    description: track.description,
                    trackNumber: track.trackNumber,
                    duration: track.duration || "--:--",
                  }))
                  .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)),
              };
            })
          );

          setLikedAlbumsData(albumsWithTracks);
        } else {
          setLikedAlbumsData([]);
        }
        if (
          (activeTab === "playlists" || activeTab === "browse") &&
          currentUser
        ) {
          const playlistsData = await playlistService.getPlaylistsWithSongs(
            currentUser.uid
          );
          const playlistsWithDurations = await Promise.all(
            playlistsData.map(async (playlist) => {
              if (playlist.tracks && playlist.tracks.length > 0) {
                const tracksWithDuration =
                  await durationService.getMultipleTrackDurations(
                    playlist.tracks,
                    false
                  );

                return {
                  ...playlist,
                  tracks: tracksWithDuration.map((track) => ({
                    id: track.id,
                    title: track.title,
                    artists: track.artists,
                    audioUrl: track.audioUrl,
                    duration: track.duration || "--:--",
                    genre: track.genre,
                    description: track.description,
                    imageUrl: track.imageUrl,
                  })),
                };
              }
              return playlist;
            })
          );

          setPlaylists(playlistsWithDurations);
        } else {
          setPlaylists([]);
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchData();
  }, [activeTab, currentUser, likedSongs, likedAlbums, likesLoading]);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 524;
      const scrollLeft =
        direction === "left"
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  const checkScrollPosition = (ref, setCanScrollLeft, setCanScrollRight) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleAlbumsScroll = () => {
    checkScrollPosition(
      albumsCarouselRef,
      setCanScrollAlbumsLeft,
      setCanScrollAlbumsRight
    );
  };

  const handlePlaylistsScroll = () => {
    checkScrollPosition(
      playlistsCarouselRef,
      setCanScrollPlaylistsLeft,
      setCanScrollPlaylistsRight
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (likedAlbumsData.length > 3) {
        checkScrollPosition(
          albumsCarouselRef,
          setCanScrollAlbumsLeft,
          setCanScrollAlbumsRight
        );
      }

      if (playlists.length > 3) {
        checkScrollPosition(
          playlistsCarouselRef,
          setCanScrollPlaylistsLeft,
          setCanScrollPlaylistsRight
        );
      }
    }, 100);
  }, [likedAlbumsData, playlists]);

  const renderContent = () => {
    if (loading || initialLoad) {
      return (
        <LoadingState>
          <LoadingMessage>Loading your library...</LoadingMessage>
        </LoadingState>
      );
    }

    switch (activeTab) {
      case "browse":
        const hasContent =
          playlists.length > 0 ||
          likedAlbumsData.length > 0 ||
          likedSongsData.length > 0;

        if (!hasContent) {
          return (
            <EmptyState>
              <EmptyMessage>
                Your library is empty. Start creating playlists and hearting
                tracks!{" "}
                <span role="img" aria-label="musical notes">
                  🎵
                </span>
              </EmptyMessage>
            </EmptyState>
          );
        }

        return (
          <BrowseContainer>
            {playlists.length > 0 && (
              <>
                {playlists.length > 3 ? (
                  <CarouselWrapper>
                    <SectionHeader>
                      <SectionTitle>Playlists</SectionTitle>
                      <CarouselControls>
                        <CarouselButton
                          onClick={() =>
                            scrollCarousel(playlistsCarouselRef, "left")
                          }
                          disabled={!canScrollPlaylistsLeft}
                          $rotate={true}
                          style={{
                            opacity: canScrollPlaylistsLeft ? 1 : 0,
                            pointerEvents: canScrollPlaylistsLeft
                              ? "auto"
                              : "none",
                          }}
                        >
                          <RightCircleIcon />
                        </CarouselButton>
                        <CarouselButton
                          onClick={() =>
                            scrollCarousel(playlistsCarouselRef, "right")
                          }
                          disabled={!canScrollPlaylistsRight}
                          style={{
                            opacity: canScrollPlaylistsRight ? 1 : 0,
                            pointerEvents: canScrollPlaylistsRight
                              ? "auto"
                              : "none",
                          }}
                        >
                          <RightCircleIcon />
                        </CarouselButton>
                      </CarouselControls>
                    </SectionHeader>

                    <CarouselContainer>
                      <CarouselShadowLeft $show={canScrollPlaylistsLeft} />
                      <CarouselShadowRight $show={canScrollPlaylistsRight} />

                      <Carousel
                        ref={playlistsCarouselRef}
                        onScroll={handlePlaylistsScroll}
                      >
                        {playlists.map((playlist) => {
                          let displayImage = "/mini-logo.svg";
                          let showGrid = false;
                          let gridImages = [];

                          if (playlist.tracks && playlist.tracks.length > 0) {
                            if (playlist.tracks.length >= 4) {
                              showGrid = true;
                              gridImages = playlist.tracks
                                .slice(0, 4)
                                .map(
                                  (track) => track.imageUrl || "/mini-logo.svg"
                                );
                            } else {
                              displayImage =
                                playlist.tracks[0].imageUrl || "/mini-logo.svg";
                            }
                          }

                          return (
                            <CarouselItem key={playlist.id}>
                              <ExpandedPlaylist
                                id={playlist.id}
                                image={displayImage}
                                name={playlist.name}
                                type="playlist"
                                artist={playlist.artist || "You"}
                                tracks={playlist.tracks}
                                showGrid={showGrid}
                                gridImages={gridImages}
                                onPlay={() => handlePlaylistPlay(playlist)}
                                onViewMore={() => handleViewMore(playlist)}
                                onArtistClick={() =>
                                  handleArtistClick(
                                    playlist.artist || "You",
                                    false
                                  )
                                }
                              />
                            </CarouselItem>
                          );
                        })}
                      </Carousel>
                    </CarouselContainer>
                  </CarouselWrapper>
                ) : (
                  <GridSection>
                    <SectionTitle>Playlists</SectionTitle>
                    <RegularGrid>
                      {playlists.map((playlist) => {
                        let displayImage = "/mini-logo.svg";
                        let showGrid = false;
                        let gridImages = [];

                        if (playlist.tracks && playlist.tracks.length > 0) {
                          if (playlist.tracks.length >= 4) {
                            showGrid = true;
                            gridImages = playlist.tracks
                              .slice(0, 4)
                              .map(
                                (track) => track.imageUrl || "/mini-logo.svg"
                              );
                          } else {
                            displayImage =
                              playlist.tracks[0].imageUrl || "/mini-logo.svg";
                          }
                        }

                        return (
                          <Playlist
                            key={playlist.id}
                            id={playlist.id}
                            image={displayImage}
                            name={playlist.name}
                            type="playlist"
                            artist={playlist.artist || "You"}
                            tracks={playlist.tracks}
                            showGrid={showGrid}
                            gridImages={gridImages}
                            onPlay={() => handlePlaylistPlay(playlist)}
                            onViewMore={() => handleViewMore(playlist)}
                            onArtistClick={() =>
                              handleArtistClick(playlist.artist || "You", false)
                            }
                          />
                        );
                      })}
                    </RegularGrid>
                  </GridSection>
                )}
              </>
            )}
            {likedAlbumsData.length > 0 && (
              <>
                {likedAlbumsData.length > 3 ? (
                  <CarouselWrapper>
                    <SectionHeader>
                      <SectionTitle>Albums</SectionTitle>
                      <CarouselControls>
                        <CarouselButton
                          onClick={() =>
                            scrollCarousel(albumsCarouselRef, "left")
                          }
                          disabled={!canScrollAlbumsLeft}
                          $rotate={true}
                          style={{
                            opacity: canScrollAlbumsLeft ? 1 : 0,
                            pointerEvents: canScrollAlbumsLeft
                              ? "auto"
                              : "none",
                          }}
                        >
                          <RightCircleIcon />
                        </CarouselButton>
                        <CarouselButton
                          onClick={() =>
                            scrollCarousel(albumsCarouselRef, "right")
                          }
                          disabled={!canScrollAlbumsRight}
                          style={{
                            opacity: canScrollAlbumsRight ? 1 : 0,
                            pointerEvents: canScrollAlbumsRight
                              ? "auto"
                              : "none",
                          }}
                        >
                          <RightCircleIcon />
                        </CarouselButton>
                      </CarouselControls>
                    </SectionHeader>

                    <CarouselContainer>
                      <CarouselShadowLeft $show={canScrollAlbumsLeft} />
                      <CarouselShadowRight $show={canScrollAlbumsRight} />

                      <Carousel
                        ref={albumsCarouselRef}
                        onScroll={handleAlbumsScroll}
                      >
                        {likedAlbumsData.map((album) => (
                          <CarouselItem key={album.id}>
                            <ExpandedPlaylist
                              id={album.id}
                              image={album.image}
                              name={album.name}
                              type={album.type}
                              artist={album.artist}
                              tracks={album.tracks}
                              onPlay={() => handleAlbumPlay(album)}
                              onViewMore={() => handleViewMore(album)}
                              onArtistClick={() =>
                                handleArtistClick(album.artist, true)
                              }
                            />
                          </CarouselItem>
                        ))}
                      </Carousel>
                    </CarouselContainer>
                  </CarouselWrapper>
                ) : (
                  <GridSection>
                    <SectionTitle>Albums</SectionTitle>
                    <RegularGrid>
                      {likedAlbumsData.map((album) => (
                        <Playlist
                          key={album.id}
                          id={album.id}
                          image={album.image}
                          name={album.name}
                          type={album.type}
                          artist={album.artist}
                          tracks={album.tracks}
                          onPlay={() => handleAlbumPlay(album)}
                          onViewMore={() => handleViewMore(album)}
                          onArtistClick={() =>
                            handleArtistClick(album.artist, true)
                          }
                        />
                      ))}
                    </RegularGrid>
                  </GridSection>
                )}
              </>
            )}
            {likedSongsData.length > 0 && (
              <SongsSection>
                <SectionTitle>Liked Songs</SectionTitle>
                <SongsGrid>
                  {likedSongsData.map((song) => (
                    <SongItemWide key={song.id}>
                      <Song
                        {...song}
                        allSongs={likedSongsData}
                        onArtistClick={(specificArtist) =>
                          handleArtistClick(
                            specificArtist || song.artist,
                            false
                          )
                        }
                      />
                    </SongItemWide>
                  ))}
                </SongsGrid>
              </SongsSection>
            )}
          </BrowseContainer>
        );

      case "likes":
        if (likedSongsData.length === 0) {
          return (
            <EmptyState>
              <EmptyMessage>
                No liked songs yet. Start hearting some tracks! ❤️
              </EmptyMessage>
            </EmptyState>
          );
        }

        return (
          <SongsOnlyGrid>
            {likedSongsData.map((song) => (
              <SongItemWide key={song.id}>
                <Song
                  {...song}
                  allSongs={likedSongsData}
                  onArtistClick={() => handleArtistClick(song.artist, false)}
                />
              </SongItemWide>
            ))}
          </SongsOnlyGrid>
        );

      case "albums":
        if (likedAlbumsData.length === 0) {
          return (
            <EmptyState>
              <EmptyMessage>
                No liked albums yet. Start hearting some albums! 💿
              </EmptyMessage>
            </EmptyState>
          );
        }
        return (
          <AlbumsOnlyGrid>
            {likedAlbumsData.map((album) => (
              <Playlist
                key={album.id}
                id={album.id}
                image={album.image}
                name={album.name}
                type={album.type}
                artist={album.artist}
                tracks={album.tracks}
                onPlay={() => handleAlbumPlay(album)}
                onViewMore={() => handleViewMore(album)}
                onArtistClick={() => handleArtistClick(album.artist, true)}
              />
            ))}
          </AlbumsOnlyGrid>
        );

      case "playlists":
        if (playlists.length === 0) {
          return (
            <EmptyState>
              <EmptyMessage>
                No playlists yet. Create your first playlist!{" "}
                <span role="img" aria-label="musical notes">
                  🎵
                </span>
              </EmptyMessage>
            </EmptyState>
          );
        }
        return (
          <AlbumsOnlyGrid>
            {playlists.map((playlist) => {
              let displayImage = "/mini-logo.svg";
              let showGrid = false;
              let gridImages = [];

              if (playlist.tracks && playlist.tracks.length > 0) {
                if (playlist.tracks.length >= 4) {
                  showGrid = true;
                  gridImages = playlist.tracks
                    .slice(0, 4)
                    .map((track) => track.imageUrl || "/mini-logo.svg");
                } else {
                  displayImage =
                    playlist.tracks[0].imageUrl || "/mini-logo.svg";
                }
              }

              return (
                <Playlist
                  key={playlist.id}
                  id={playlist.id}
                  image={displayImage}
                  name={playlist.name}
                  type="playlist"
                  artist={playlist.artist || "You"}
                  tracks={playlist.tracks}
                  showGrid={showGrid}
                  gridImages={gridImages}
                  onPlay={() => handlePlaylistPlay(playlist)}
                  onViewMore={() => handleViewMore(playlist)}
                  onArtistClick={() =>
                    handleArtistClick(playlist.artist || "You", false)
                  }
                />
              );
            })}
          </AlbumsOnlyGrid>
        );

      default:
        return (
          <EmptyState>
            <EmptyMessage>Browse feature coming soon! 🔍</EmptyMessage>
          </EmptyState>
        );
    }
  };

  const handlePlaylistPlay = (playlist) => {
    console.log("Play playlist:", playlist.name);
  };

  const handleArtistClick = async (artistName, isAlbum = false) => {
    try {
      if (!isAlbum) {
        navigate(`/profile/${artistName}`);
        return;
      }
      const { userService } = await import("../../../services/api");

      try {
        const users = await userService.searchUsers(artistName, 10);
        const matchingUser = users.find(
          (user) =>
            user.displayName?.toLowerCase() === artistName?.toLowerCase()
        );

        if (matchingUser?.username) {
          navigate(`/profile/${matchingUser.username}`);
          return;
        }
      } catch (searchError) {
        console.warn("Could not search for artist:", searchError);
      }
      try {
        const userData = await userService.getUserByUsername(artistName);
        if (userData?.username) {
          navigate(`/profile/${userData.username}`);
          return;
        }
      } catch (error) {
        console.warn("Could not find user by username:", artistName);
      }

      console.log("Could not find artist profile");
    } catch (error) {
      console.error("Error navigating to artist:", error);
    }
  };

  return (
    <Wrapper>
      <Tabs>
        {LIBRARY_TABS.map((tab) => (
          <TabButton
            key={tab.value}
            $active={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </Tabs>

      {renderContent()}
    </Wrapper>
  );
};

const GridSection = styled.div`
  width: 100%;
  margin-bottom: 48px;
`;

const RegularGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
`;

const BrowseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
`;

const CarouselWrapper = styled.div`
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const CarouselControls = styled.div`
  display: flex;
  gap: 8px;
`;

const CarouselButton = styled.button`
  background: rgba(35, 35, 35, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${({ $rotate }) => ($rotate ? "rotate(180deg)" : "none")};
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  &:hover:not(:disabled) {
    background: rgba(255, 67, 67, 0.9);
    border-color: rgba(255, 67, 67, 0.8);
    transform: ${({ $rotate }) =>
      $rotate ? "rotate(180deg) scale(1.1)" : "scale(1.1)"};
    box-shadow: 0 6px 16px rgba(255, 67, 67, 0.3);
  }

  &:disabled {
    opacity: 0;
    cursor: not-allowed;
    transform: ${({ $rotate }) =>
      $rotate ? "rotate(180deg) scale(0.8)" : "scale(0.8)"};
    pointer-events: none;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselShadowLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(
    to right,
    #232323 0%,
    rgba(35, 35, 35, 0.8) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CarouselShadowRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(
    to left,
    #232323 0%,
    rgba(35, 35, 35, 0.8) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Carousel = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 0 16px 0;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  width: 500px;
  height: 292px;
`;

const SongsSection = styled.div`
  width: 100%;
`;

const SongsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const AlbumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 24px;
  width: 100%;
`;

const AlbumsOnlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
`;

export default LibraryDisplay;

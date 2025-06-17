import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  searchService,
  trackService,
  durationService,
} from "../../../services/api";
import Song from "../MusicBlocks/Song";
import Playlist from "../MusicBlocks/Playlist";
import UserResult from "./UserResult";

const SearchResults = ({ searchTerm, activeFilter, isGuestMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    songs: [],
    albums: [],
    eps: [],
    artists: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchContent = async () => {
      if (!searchTerm.trim()) {
        setResults({ songs: [], albums: [], eps: [], artists: [] });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const promises = [];

        if (activeFilter === "everything" || activeFilter === "songs") {
          promises.push(
            searchSongsWithDuration(
              searchTerm,
              activeFilter === "songs" ? 50 : 10
            )
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        if (activeFilter === "everything" || activeFilter === "albums") {
          promises.push(
            searchAlbumsWithTracks(
              searchTerm,
              "album",
              activeFilter === "albums" ? 50 : 10
            )
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        if (activeFilter === "everything" || activeFilter === "eps") {
          promises.push(
            searchAlbumsWithTracks(
              searchTerm,
              "ep",
              activeFilter === "eps" ? 50 : 10
            )
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        if (activeFilter === "everything" || activeFilter === "artists") {
          promises.push(
            searchService.searchUsers(
              searchTerm,
              activeFilter === "artists" ? 50 : 10
            )
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        const [songs, albums, eps, artists] = await Promise.all(promises);

        setResults({
          songs: songs || [],
          albums: albums || [],
          eps: eps || [],
          artists: artists || [],
        });
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilter]);

  const searchSongsWithDuration = async (searchTerm, limit) => {
    try {
      const songs = await searchService.searchTracks(searchTerm, limit);
      if (songs.length === 0) return [];

      const songsWithDuration = await durationService.getMultipleTrackDurations(
        songs,
        false
      );
      return songsWithDuration;
    } catch (error) {
      console.error("Error searching songs with duration:", error);
      return [];
    }
  };

  const searchAlbumsWithTracks = async (searchTerm, type, limit) => {
    try {
      let albums = [];
      if (type === "ep") {
        try {
          albums = await searchService.searchAlbumsByType(
            searchTerm,
            "ep",
            limit
          );
        } catch (error) {
          console.warn(
            "EP search method not available, using fallback:",
            error
          );
          const allAlbums = await searchService.searchAlbums(searchTerm, limit);
          albums = allAlbums.filter(
            (album) => album.type?.toLowerCase() === "ep"
          );
        }
      } else {
        albums = await searchService.searchAlbums(searchTerm, limit);

        if (type === "album") {
          albums = albums.filter((album) => {
            const albumType = album.type?.toLowerCase();
            return albumType !== "ep";
          });
        }
      }

      if (albums.length === 0) return [];

      const albumsWithTracks = await Promise.all(
        albums.map(async (album) => {
          try {
            let tracks = [];

            if (album.songIds && album.songIds.length > 0) {
              tracks = await trackService.getTracksByIds(album.songIds);
            } else {
              try {
                tracks = await trackService.getTracksByAlbumId(album.id);
              } catch (error) {
                console.warn(`No tracks found for album ${album.id}:`, error);
                tracks = [];
              }
            }

            let tracksWithDuration = [];
            if (tracks.length > 0) {
              tracksWithDuration =
                await durationService.getMultipleTrackDurations(tracks, false);
            }

            return {
              ...album,
              tracks: tracksWithDuration
                .map((track) => ({
                  id: track.id,
                  title: track.title,
                  artists: track.artists,
                  audioUrl: track.audioUrl,
                  duration: track.duration,
                  genre: track.genre,
                  description: track.description,
                  imageUrl: track.imageUrl,
                  trackNumber: track.trackNumber,
                }))
                .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0)),
            };
          } catch (trackError) {
            console.warn(
              `Error fetching tracks for ${type} ${album.id}:`,
              trackError
            );
            return {
              ...album,
              tracks: [],
            };
          }
        })
      );

      return albumsWithTracks;
    } catch (error) {
      console.error(`Error searching ${type}s with tracks:`, error);
      return [];
    }
  };

  if (loading) {
    return (
      <LoadingState>
        <LoadingSpinner />
        <LoadingText>Searching...</LoadingText>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorText>{error}</ErrorText>
      </ErrorState>
    );
  }

  const hasResults =
    results.songs.length > 0 ||
    results.albums.length > 0 ||
    results.eps.length > 0 ||
    results.artists.length > 0;

  if (!hasResults) {
    return (
      <NoResultsState>
        <NoResultsIcon>🔍</NoResultsIcon>
        <NoResultsTitle>No results found</NoResultsTitle>
        <NoResultsText>
          Try searching with different keywords or check your spelling
        </NoResultsText>
      </NoResultsState>
    );
  }

  const renderEPs = () => {
    if (results.eps.length === 0) return null;

    return (
      <ResultSection>
        <SectionHeader>
          <SectionTitle>EPs</SectionTitle>
          <ResultCount>
            {results.eps.length} result{results.eps.length !== 1 ? "s" : ""}
          </ResultCount>
        </SectionHeader>
        <AlbumsGrid>
          {results.eps.map((ep) => (
            <AlbumItem key={ep.id}>
              <Playlist
                id={ep.id}
                image={ep.imageUrl}
                name={ep.name}
                type="ep"
                artist={ep.artist}
                tracks={ep.tracks || []}
                isGuestMode={isGuestMode}
                onPlay={() => console.log("Play EP:", ep.name)}
                onViewMore={() => console.log("View EP:", ep.name)}
              />
            </AlbumItem>
          ))}
        </AlbumsGrid>
      </ResultSection>
    );
  };

  const renderSongs = () => {
    if (results.songs.length === 0) return null;

    return (
      <ResultSection>
        <SectionHeader>
          <SectionTitle>Songs</SectionTitle>
          <ResultCount>
            {results.songs.length} result{results.songs.length !== 1 ? "s" : ""}
          </ResultCount>
        </SectionHeader>
        <SongsGrid>
          {results.songs.map((song) => (
            <SongItemWide key={song.id}>
              <Song
                id={song.id}
                name={song.title}
                artist={
                  song.artists ? song.artists.join(", ") : "Unknown Artist"
                }
                duration={song.duration || "--:--"}
                plays={song.plays || 0}
                image={song.imageUrl}
                audioUrl={song.audioUrl}
                genre={song.genre}
                description={song.description}
                isGuestMode={isGuestMode}
                allSongs={results.songs.map((s) => ({
                  id: s.id,
                  name: s.title,
                  artist: s.artists ? s.artists.join(", ") : "Unknown Artist",
                  image: s.imageUrl,
                  audioUrl: s.audioUrl,
                  duration: s.duration || "--:--",
                  genre: s.genre,
                  description: s.description,
                }))}
              />
            </SongItemWide>
          ))}
        </SongsGrid>
      </ResultSection>
    );
  };

  const renderAlbums = () => {
    if (results.albums.length === 0) return null;

    return (
      <ResultSection>
        <SectionHeader>
          <SectionTitle>Albums</SectionTitle>
          <ResultCount>
            {results.albums.length} result
            {results.albums.length !== 1 ? "s" : ""}
          </ResultCount>
        </SectionHeader>
        <AlbumsGrid>
          {results.albums.map((album) => (
            <AlbumItem key={album.id}>
              <Playlist
                id={album.id}
                image={album.imageUrl}
                name={album.name}
                type="album"
                artist={album.artist}
                tracks={album.tracks || []}
                isGuestMode={isGuestMode}
                onPlay={() => console.log("Play album:", album.name)}
                onViewMore={() => console.log("View album:", album.name)}
              />
            </AlbumItem>
          ))}
        </AlbumsGrid>
      </ResultSection>
    );
  };

  const renderArtists = () => {
    if (results.artists.length === 0) return null;

    return (
      <ResultSection>
        <SectionHeader>
          <SectionTitle>Artists</SectionTitle>
          <ResultCount>
            {results.artists.length} result
            {results.artists.length !== 1 ? "s" : ""}
          </ResultCount>
        </SectionHeader>
        <ArtistsGrid>
          {results.artists.map((artist) => (
            <UserResult
              key={artist.id}
              user={artist}
              isGuestMode={isGuestMode}
            />
          ))}
        </ArtistsGrid>
      </ResultSection>
    );
  };

  const renderFilteredResults = () => {
    switch (activeFilter) {
      case "songs":
        return renderSongs();
      case "albums":
        return renderAlbums();
      case "eps":
        return renderEPs();
      case "artists":
        return renderArtists();
      default:
        return (
          <>
            {renderArtists()}
            {renderAlbums()}
            {renderEPs()}
            {renderSongs()}
          </>
        );
    }
  };

  return <ResultsContainer>{renderFilteredResults()}</ResultsContainer>;
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const ResultSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const ResultCount = styled.span`
  color: #888;
  font-size: 14px;
`;

const SongsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const SongItemWide = styled.div`
  width: 100%;

  > div {
    width: 100% !important;
    max-width: 1190px !important;
  }
`;

const AlbumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const AlbumItem = styled.div`
  width: 100%;
`;

const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #333;
  border-top: 3px solid #ff4343;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #888;
  font-size: 16px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: #ff4343;
  font-size: 18px;
`;

const NoResultsState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

const NoResultsIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const NoResultsTitle = styled.h3`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const NoResultsText = styled.p`
  color: #888;
  font-size: 16px;
  margin: 0;
  max-width: 400px;
`;

export default SearchResults;

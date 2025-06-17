import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { playlistService } from "../services/api/playlistService";
import { durationService } from "../services/api/durationService";
import { usePlaylist } from "../services/PlaylistContext";
import { useAudio } from "../services/AudioContext";
import Song from "../components/blocks/MusicBlocks/Song";
import PlaylistBanner from "../components/blocks/PlaylistBlocks/PlaylistBanner";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import { formatNumber } from "../utils/formatNumbers";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { removeSongFromPlaylist } = usePlaylist();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTemporary, setIsTemporary] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        if (
          (playlistId === "fresh-finds" ||
            playlistId === "fresh-finds-playlist" ||
            playlistId.startsWith("fresh-finds-") ||
            playlistId.includes("fresh-")) &&
          location.state?.playlist
        ) {
          const tempPlaylist = location.state.playlist;

          const formattedPlaylist = {
            id: tempPlaylist.id,
            name: tempPlaylist.name,
            artist: tempPlaylist.artist,
            createdBy: tempPlaylist.artist,
            tracks: tempPlaylist.tracks.map((track) => ({
              id: track.id,
              name: track.title,
              artist: track.artists
                ? track.artists.join(", ")
                : track.artist || "Unknown Artist",
              duration: track.duration || "--:--",
              plays: track.actualPlays || 0,
              image: track.imageUrl,
              audioUrl: track.audioUrl,
              genre: track.genre,
              description: track.description,
            })),
          };

          setPlaylist(formattedPlaylist);
          setIsTemporary(true);
          setLoading(false);
          return;
        }

        if (
          (playlistId.startsWith("trending-") ||
            playlistId.includes("trending")) &&
          location.state?.playlist
        ) {
          const tempPlaylist = location.state.playlist;

          const formattedPlaylist = {
            id: tempPlaylist.id,
            name: tempPlaylist.name,
            artist: tempPlaylist.artist,
            createdBy: tempPlaylist.artist,
            tracks: tempPlaylist.tracks.map((track) => ({
              id: track.id,
              name: track.title,
              artist: track.artists
                ? track.artists.join(", ")
                : track.artist || "Unknown Artist",
              duration: track.duration || "--:--",
              plays: track.actualPlays || 0,
              image: track.imageUrl,
              audioUrl: track.audioUrl,
              genre: track.genre,
              description: track.description,
            })),
          };

          setPlaylist(formattedPlaylist);
          setIsTemporary(true);
          setLoading(false);
          return;
        }

        if (
          playlistId.startsWith("following-mix-") &&
          location.state?.playlist
        ) {
          const tempPlaylist = location.state.playlist;

          const formattedPlaylist = {
            id: tempPlaylist.id,
            name: tempPlaylist.name,
            artist: tempPlaylist.artist,
            createdBy: tempPlaylist.artist,
            tracks: tempPlaylist.tracks.map((track) => ({
              id: track.id,
              name: track.title,
              artist: track.artists
                ? track.artists.join(", ")
                : track.artist || "Unknown Artist",
              duration: track.duration || "--:--",
              plays: track.plays || 0,
              image: track.imageUrl,
              audioUrl: track.audioUrl,
              genre: track.genre,
              description: track.description,
            })),
          };

          setPlaylist(formattedPlaylist);
          setIsTemporary(true);
          setLoading(false);
          return;
        }

        if (
          (playlistId.startsWith("fresh-finds-") ||
            playlistId.startsWith("trending-") ||
            playlistId.startsWith("following-mix-") ||
            playlistId.includes("fresh-") ||
            playlistId.includes("trending") ||
            playlistId.includes("following")) &&
          !location.state?.playlist
        ) {
          console.warn(
            `Temporary playlist ${playlistId} accessed without state data`
          );
          navigate("/home", { replace: true });
          return;
        }

        const playlistData = await playlistService.getPlaylistById(playlistId);

        if (playlistData.songIds && playlistData.songIds.length > 0) {
          const { trackService } = await import("../services/api");
          const songs = await trackService.getTracksByIds(playlistData.songIds);

          const songsWithDuration =
            await durationService.getMultipleTrackDurations(songs, false);

          const tracks = songsWithDuration.map((song) => ({
            id: song.id,
            name: song.title,
            artist: song.artists ? song.artists.join(", ") : "Unknown Artist",
            duration: song.duration || "--:--",
            plays: song.plays || 0,
            image: song.imageUrl,
            audioUrl: song.audioUrl,
            genre: song.genre,
            description: song.description,
          }));

          setPlaylist({
            ...playlistData,
            tracks,
          });
        } else {
          setPlaylist({
            ...playlistData,
            tracks: [],
          });
        }
        setIsTemporary(false);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        if (error.message === "Playlist not found") {
          if (
            playlistId.includes("fresh-") ||
            playlistId.includes("trending")
          ) {
            navigate("/home", { replace: true });
          } else {
            navigate("/library", { replace: true });
          }
        } else {
          navigate("/library", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId, navigate, location.state]);

  const handlePlaylistDelete = () => {
    if (isTemporary) {
      navigate("/home");
    } else {
      navigate("/library");
    }
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    if (isTemporary) {
      setPlaylist((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((track) => track.id !== songId),
      }));
      return { success: true };
    }

    try {
      await removeSongFromPlaylist(playlistId, songId);
      setPlaylist((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((track) => track.id !== songId),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <MainWrapper>
        <Navbar />
        <ContentWrapper>
          <LoadingMessage>Loading playlist...</LoadingMessage>
        </ContentWrapper>
        <ControlBar />
      </MainWrapper>
    );
  }

  if (!playlist) {
    return (
      <MainWrapper>
        <Navbar />
        <ContentWrapper>
          <ErrorMessage>Playlist not found</ErrorMessage>
        </ContentWrapper>
        <ControlBar />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Navbar />
      <ContentWrapper>
        <PlaylistBanner
          playlist={playlist}
          tracks={playlist.tracks}
          onDelete={handlePlaylistDelete}
          isTemporary={isTemporary}
        />

        {playlist.tracks.length > 0 ? (
          <SongsSection>
            <SongsHeader>Songs</SongsHeader>
            <SongsList>
              {playlist.tracks.map((song, index) => (
                <SongItemWide key={song.id}>
                  <Song
                    {...song}
                    allSongs={playlist.tracks}
                    playlistId={playlistId}
                    onRemoveFromPlaylist={
                      isTemporary ? undefined : handleRemoveSongFromPlaylist
                    }
                  />
                </SongItemWide>
              ))}
            </SongsList>
          </SongsSection>
        ) : (
          <EmptyState>
            <EmptyMessage>This playlist is empty</EmptyMessage>
            <EmptySubtext>Add some songs to get started!</EmptySubtext>
          </EmptyState>
        )}
      </ContentWrapper>
      <ControlBar />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #232323;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 120px;
`;

const LoadingMessage = styled.div`
  color: #d9d9d9;
  font-size: 18px;
  text-align: center;
  padding: 80px 0;
`;

const ErrorMessage = styled.div`
  color: #ff4343;
  font-size: 18px;
  text-align: center;
  padding: 80px 0;
`;

const SongsSection = styled.div`
  max-width: 1190px;
  margin: 40px auto;
  padding: 0 40px;
`;

const SongsHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
`;

const SongsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SongItemWide = styled.div`
  width: 100%;

  > div {
    width: 100% !important;
    max-width: none !important;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  max-width: 1190px;
  margin: 40px auto;
`;

const EmptyMessage = styled.div`
  color: #d9d9d9;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const EmptySubtext = styled.div`
  color: #888;
  font-size: 16px;
`;

export default PlaylistPage;

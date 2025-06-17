import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../../../services/AudioContext";
import {
  useTrendingPlaylists,
  useFreshFinds,
  useFollowingFeed,
} from "../../../hooks/home-hooks";
import { usePlaylists } from "../../../hooks/profile-hooks/usePlaylists";
import { useAuth } from "../../../services/auth/AuthContext";
import TrendingByGenreSection from "./Sections/TrendingByGenreSection";
import FreshFindsSection from "./Sections/FreshFindsSection";
import UserPlaylistsSection from "./Sections/UserPlaylistsSection";
import FollowingFeedSection from "./Sections/FollowingFeedSection";
import styled from "styled-components";

const HomeContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setCurrentSong, setQueue, setCurrentIndex } = useAudio();

  const { trendingPlaylists, loading: trendingLoading } =
    useTrendingPlaylists();
  const { freshFindsPlaylists, loading: freshFindsLoading } = useFreshFinds();
  const { followingMixPlaylist, loading: followingLoading } =
    useFollowingFeed();
  const { playlists: userPlaylists, loading: userPlaylistsLoading } =
    usePlaylists(currentUser?.uid);

  const isLoading =
    trendingLoading ||
    freshFindsLoading ||
    followingLoading ||
    userPlaylistsLoading;

  useEffect(() => {
    const clearFreshFindsCache = () => {
      try {
        const keys = Object.keys(localStorage);
        const freshFindsKeys = keys.filter((key) =>
          key.startsWith("freshFinds_")
        );

        freshFindsKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
      } catch (error) {
        console.warn("Error clearing Fresh Finds cache:", error);
      }
    };

    clearFreshFindsCache();
  }, []);

  const handlePlaylistPlay = (playlist) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      const validTracks = playlist.tracks.filter((track) => track.audioUrl);
      if (validTracks.length > 0) {
        setQueue(validTracks);
        setCurrentIndex(0);
        setCurrentSong(validTracks[0]);
      }
    }
  };

  const handleViewMore = (playlist) => {
    navigate("/playlist/fresh-finds", {
      state: {
        playlist: playlist,
        isTemporary: true,
      },
    });
  };

  return (
    <Container>
      {isLoading && (
        <LoadingMessage>Loading your personalized home...</LoadingMessage>
      )}

      {!isLoading && (
        <>
          {trendingPlaylists.length > 0 && (
            <TrendingByGenreSection
              onPlaylistPlay={handlePlaylistPlay}
              onViewMore={handleViewMore}
            />
          )}

          {freshFindsPlaylists.length > 0 && (
            <FreshFindsSection
              onPlaylistPlay={handlePlaylistPlay}
              onViewMore={handleViewMore}
            />
          )}

          {followingMixPlaylist && (
            <FollowingFeedSection
              onPlaylistPlay={handlePlaylistPlay}
              onViewMore={handleViewMore}
            />
          )}

          {userPlaylists.length > 0 && (
            <UserPlaylistsSection onPlaylistPlay={handlePlaylistPlay} />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 32px 0 40px 0;
`;

const LoadingMessage = styled.div`
  color: #d9d9d9;
  font-size: 18px;
  text-align: center;
  padding: 80px 0;
`;

export default HomeContent;

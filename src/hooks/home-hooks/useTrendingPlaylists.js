import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import {
  trackService,
  durationService,
  playCountService,
} from "../../services/api";

export const useTrendingPlaylists = () => {
  const { currentUser } = useAuth();
  const [trendingPlaylists, setTrendingPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = [
    "Pop",
    "Hip-Hop",
    "Rock",
    "Electronic",
    "R&B",
    "Jazz",
    "Country",
    "Classical",
  ];

  useEffect(() => {
    fetchTrendingPlaylists();
    cleanupOldTrendingCache();
  }, [currentUser]);

  const fetchTrendingPlaylists = async () => {
    try {
      setLoading(true);
      const today = new Date().toDateString();
      const storageKey = `trending_${currentUser?.uid || "guest"}`;
      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.date === today && parsedData.playlists) {
            setTrendingPlaylists(parsedData.playlists);
            setLoading(false);
            return;
          }
        } catch (error) {
          localStorage.removeItem(storageKey);
        }
      }

      const playlists = [];

      for (const genre of genres) {
        try {
          const tracks = await trackService.getTracksByGenre(genre, 25);
          if (tracks.length === 0) continue;
          const trackIds = tracks.map((track) => track.id);
          const playCountsMap = await playCountService.getMultiplePlayCounts(
            trackIds
          );
          const trendingTracks = tracks.filter((track) => {
            const actualPlays = playCountsMap.get(track.id) || 0;
            return actualPlays >= 200 && track.audioUrl;
          });

          if (trendingTracks.length === 0) continue;

          const shuffled = [...trendingTracks].sort(() => Math.random() - 0.5);
          const selectedTracks = shuffled.slice(0, 10);

          const tracksWithDuration =
            await durationService.getMultipleTrackDurations(selectedTracks);

          const playlist = createGenrePlaylist(
            genre,
            tracksWithDuration,
            playCountsMap
          );
          if (playlist) {
            playlists.push(playlist);
          }
        } catch (error) {
          console.warn(`Error fetching ${genre} tracks:`, error);
        }
      }

      const cacheData = {
        date: today,
        playlists: playlists,
        generatedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(cacheData));
      } catch (error) {
        console.warn("Could not cache trending playlists:", error);
      }

      setTrendingPlaylists(playlists);
    } catch (error) {
      console.error("Error fetching trending by genre:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGenrePlaylist = (genre, tracks, playCountsMap) => {
    if (tracks.length === 0) return null;

    const userDisplayName =
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "You";

    let displayImage = "/mini-logo.svg";
    let showGrid = false;
    let gridImages = [];

    if (tracks.length >= 4) {
      showGrid = true;
      gridImages = tracks
        .slice(0, 4)
        .map((track) => track.imageUrl || "/mini-logo.svg");
    } else if (tracks.length > 0) {
      displayImage = tracks[0]?.imageUrl || "/mini-logo.svg";
    }

    return {
      id: `trending-${genre.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: `${genre} Mix`,
      type: "playlist",
      artist: `Made for ${userDisplayName}`,
      tracks: tracks.map((track) => ({
        id: track.id,
        title: track.title,
        artists: track.artists || [track.artist || "Unknown Artist"],
        artist: track.artists
          ? track.artists.join(", ")
          : track.artist || "Unknown Artist",
        audioUrl: track.audioUrl,
        duration: track.duration,
        genre: track.genre,
        imageUrl: track.imageUrl,
        actualPlays: playCountsMap.get(track.id) || 0,
      })),
      image: displayImage,
      showGrid: showGrid,
      gridImages: gridImages,
    };
  };

  const cleanupOldTrendingCache = () => {
    try {
      const keys = Object.keys(localStorage);
      const trendingKeys = keys.filter((key) => key.startsWith("trending_"));
      const today = new Date().toDateString();

      trendingKeys.forEach((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.date !== today) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Error cleaning up trending cache:", error);
    }
  };

  return { trendingPlaylists, loading, refetch: fetchTrendingPlaylists };
};

export const useFreshFinds = () => {};
export const useCarouselScroll = (scrollKey, items) => {};

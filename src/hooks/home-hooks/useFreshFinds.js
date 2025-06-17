import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import {
  trackService,
  durationService,
  playCountService,
} from "../../services/api";

export const useFreshFinds = () => {
  const { currentUser } = useAuth();
  const [freshFindsPlaylists, setFreshFindsPlaylists] = useState([]);
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
    fetchFreshFinds();
    cleanupOldFreshFinds();
  }, [currentUser]);

  const fetchFreshFinds = async () => {
    try {
      setLoading(true);
      const today = new Date().toDateString();
      const storageKey = `freshFinds_${currentUser?.uid || "guest"}`;
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData.date === today && parsedData.playlists) {
            setFreshFindsPlaylists(parsedData.playlists);
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
          const freshTracks = tracks.filter((track) => {
            const actualPlays = playCountsMap.get(track.id) || 0;
            return actualPlays < 200 && track.audioUrl;
          });

          if (freshTracks.length === 0) continue;
          const todaySeed =
            new Date().getFullYear() * 10000 +
            new Date().getMonth() * 100 +
            new Date().getDate() +
            (currentUser?.uid ? currentUser.uid.charCodeAt(0) : 0) +
            genre.charCodeAt(0);

          let seedValue = todaySeed;
          const seededRandom = () => {
            seedValue = (seedValue * 9301 + 49297) % 233280;
            return seedValue / 233280;
          };

          const shuffled = [...freshTracks];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

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
          console.warn(`Error fetching Fresh Finds for ${genre}:`, error);
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
        console.warn("Could not cache Fresh Finds playlists:", error);
      }

      setFreshFindsPlaylists(playlists);
    } catch (error) {
      console.error("Error fetching Fresh Finds:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGenrePlaylist = (genre, tracks, playCountsMap) => {
    if (tracks.length === 0) return null;

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
      id: `fresh-finds-${genre.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: `Fresh ${genre}`,
      type: "playlist",
      artist: "New Artists",
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

  const cleanupOldFreshFinds = () => {
    try {
      const keys = Object.keys(localStorage);
      const freshFindsKeys = keys.filter((key) =>
        key.startsWith("freshFinds_")
      );
      const today = new Date().toDateString();

      freshFindsKeys.forEach((key) => {
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
      console.warn("Error cleaning up Fresh Finds cache:", error);
    }
  };

  return { freshFindsPlaylists, loading, refetch: fetchFreshFinds };
};

import { useState, useEffect, useCallback } from "react";
import { trackService } from "../../services/api";
import { durationService } from "../../services/api/durationService";
import { playCountService } from "../../services/api/playCountService";

export const useSongs = (userId, refreshKey = 0) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tracks = await trackService.getTracksByUserId(userId);
      const validTracks = tracks.filter(
        (track) => track.artists?.length > 0 && track.title && track.audioUrl
      );

      const songIds = validTracks.map((track) => track.id);
      const playCounts = await playCountService.getMultiplePlayCounts(songIds);

      const tracksWithDuration =
        await durationService.getMultipleTrackDurations(validTracks);

      const allSongs = tracksWithDuration.map((track) => ({
        id: track.id,
        name: track.title,
        artist: track.artists.join(", "),
        duration: track.duration || "--:--",
        plays: playCounts.get(track.id) || 0,
        image: track.imageUrl || "/mini-logo.svg",
        audioUrl: track.audioUrl,
        genre: track.genre,
        description: track.description,
        albumId: track.albumId,
        albumName: track.albumName,
        trackNumber: track.trackNumber,
        createdAt: track.createdAt,
        releaseDate: track.releaseDate,
      }));

      allSongs.sort((a, b) => {
        const aDate = a.releaseDate || a.createdAt;
        const bDate = b.releaseDate || b.createdAt;

        if (!aDate || !bDate) return 0;

        const aTime = aDate.toMillis
          ? aDate.toMillis()
          : new Date(aDate).getTime();
        const bTime = bDate.toMillis
          ? bDate.toMillis()
          : new Date(bDate).getTime();

        return bTime - aTime;
      });

      setSongs(allSongs);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to load songs");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs, refreshKey]);

  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
  };
};

import { useState, useEffect, useCallback } from "react";
import { trackService } from "../../services/api";

export const useSongsCount = (userId, initialCount = 0) => {
  const [songsCount, setSongsCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchSongsCount = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const tracks = await trackService.getTracksByUserId(userId);
        const count = tracks.filter(
          (track) =>
            track.artists &&
            track.artists.length > 0 &&
            track.title &&
            track.audioUrl
        ).length;

        setSongsCount(count);
      } catch (error) {
        console.error("Error fetching songs count:", error);
        setSongsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsCount();
  }, [userId, refreshTrigger]);

  return { songsCount, loading, refetch };
};

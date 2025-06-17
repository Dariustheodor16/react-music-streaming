import { useState, useEffect, useCallback } from "react";
import { albumService } from "../../services/api/albumService";

export const useAlbumsCount = (userId, initialCount = 0) => {
  const [albumsCount, setAlbumsCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchAlbumsCount = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const albums = await albumService.getAlbumsByUserId(userId);
        const count = albums.length;

        setAlbumsCount(count);
      } catch (error) {
        console.error("Error fetching albums count:", error);
        setAlbumsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsCount();
  }, [userId, refreshTrigger]);

  return { albumsCount, loading, refetch };
};

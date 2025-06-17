import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import { playCountService } from "../../services/api/playCountService";

export const usePlayCount = () => {
  const { currentUser } = useAuth();
  const [playCounts, setPlayCounts] = useState(new Map());
  const [playTimers, setPlayTimers] = useState(new Map());

  const loadPlayCount = useCallback(
    async (songId) => {
      if (playCounts.has(songId)) {
        return playCounts.get(songId);
      }

      const count = await playCountService.getPlayCount(songId);
      setPlayCounts((prev) => {
        const newMap = new Map(prev);
        newMap.set(songId, count);
        return newMap;
      });

      return count;
    },
    [playCounts]
  );

  const loadMultiplePlayCounts = useCallback(
    async (songIds) => {
      const uncachedIds = songIds.filter((id) => !playCounts.has(id));

      if (uncachedIds.length === 0) {
        return playCounts;
      }

      const counts = await playCountService.getMultiplePlayCounts(uncachedIds);

      setPlayCounts((prev) => {
        const newMap = new Map(prev);
        counts.forEach((count, songId) => {
          newMap.set(songId, count);
        });
        return newMap;
      });

      return playCounts;
    },
    [playCounts]
  );

  const startPlayTracking = useCallback(
    (songId) => {
      if (!currentUser || playTimers.has(songId)) {
        return;
      }

      const timer = setTimeout(async () => {
        const result = await playCountService.recordPlay(
          songId,
          currentUser.uid
        );

        if (result.success) {
          setPlayCounts((prev) => {
            const newMap = new Map(prev);
            const currentCount = newMap.get(songId) || 0;
            newMap.set(songId, currentCount + 1);
            return newMap;
          });
        }

        setPlayTimers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(songId);
          return newMap;
        });
      }, 30000);

      setPlayTimers((prev) => {
        const newMap = new Map(prev);
        newMap.set(songId, timer);
        return newMap;
      });
    },
    [currentUser, playTimers]
  );

  const stopPlayTracking = useCallback(
    (songId) => {
      const timer = playTimers.get(songId);
      if (timer) {
        clearTimeout(timer);
        setPlayTimers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(songId);
          return newMap;
        });
      }
    },
    [playTimers]
  );

  const getPlayCount = useCallback(
    (songId) => {
      return playCounts.get(songId) || 0;
    },
    [playCounts]
  );

  useEffect(() => {
    return () => {
      playTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [playTimers]);

  return {
    loadPlayCount,
    loadMultiplePlayCounts,
    startPlayTracking,
    stopPlayTracking,
    getPlayCount,
    playCounts,
  };
};

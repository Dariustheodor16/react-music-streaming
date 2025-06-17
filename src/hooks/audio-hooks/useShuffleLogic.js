import { useState, useCallback } from "react";

export const useShuffleLogic = () => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const enableShuffle = useCallback(
    (queue, currentIndex) => {
      if (!queue.length) return { newQueue: queue, newIndex: currentIndex };

      setOriginalQueue([...queue]);
      const currentSong = queue[currentIndex];
      const shuffledQueue = shuffleArray(queue);

      const newIndex = shuffledQueue.findIndex(
        (song) => song.id === currentSong.id
      );

      setIsShuffled(true);
      return {
        newQueue: shuffledQueue,
        newIndex: newIndex >= 0 ? newIndex : 0,
      };
    },
    [shuffleArray]
  );

  const disableShuffle = useCallback(
    (currentQueue, currentIndex) => {
      if (!originalQueue.length)
        return { newQueue: currentQueue, newIndex: currentIndex };

      const currentSong = currentQueue[currentIndex];
      const restoredQueue = [...originalQueue];

      const newIndex = restoredQueue.findIndex(
        (song) => song.id === currentSong.id
      );

      setIsShuffled(false);
      setOriginalQueue([]);
      return {
        newQueue: restoredQueue,
        newIndex: newIndex >= 0 ? newIndex : 0,
      };
    },
    [originalQueue]
  );

  const toggleShuffle = useCallback(
    (queue, currentIndex) => {
      if (isShuffled) {
        return disableShuffle(queue, currentIndex);
      } else {
        return enableShuffle(queue, currentIndex);
      }
    },
    [isShuffled, enableShuffle, disableShuffle]
  );

  const shouldShuffleNewQueue = useCallback(
    (newQueue) => {
      return isShuffled ? shuffleArray(newQueue) : newQueue;
    },
    [isShuffled, shuffleArray]
  );

  const reset = useCallback(() => {
    setIsShuffled(false);
    setOriginalQueue([]);
  }, []);

  return {
    isShuffled,
    toggleShuffle,
    shouldShuffleNewQueue,
    reset,
  };
};

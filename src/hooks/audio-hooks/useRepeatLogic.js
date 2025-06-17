import { useState, useCallback } from "react";

export const REPEAT_MODES = {
  OFF: "off",
  ALL: "all",
  ONE: "one",
};

export const useRepeatLogic = () => {
  const [repeatMode, setRepeatMode] = useState(REPEAT_MODES.OFF);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((current) => {
      switch (current) {
        case REPEAT_MODES.OFF:
          return REPEAT_MODES.ALL;
        case REPEAT_MODES.ALL:
          return REPEAT_MODES.ONE;
        case REPEAT_MODES.ONE:
          return REPEAT_MODES.OFF;
        default:
          return REPEAT_MODES.OFF;
      }
    });
  }, []);

  const shouldRepeatCurrent = useCallback(() => {
    return repeatMode === REPEAT_MODES.ONE;
  }, [repeatMode]);

  const shouldRepeatQueue = useCallback(() => {
    return repeatMode === REPEAT_MODES.ALL;
  }, [repeatMode]);

  const getNextBehavior = useCallback(
    (currentIndex, queueLength, isShuffled, shuffleNewQueue) => {
      if (repeatMode === REPEAT_MODES.ONE) {
        return { action: "repeat-current" };
      }

      const isLastSong = currentIndex >= queueLength - 1;

      if (!isLastSong) {
        return { action: "next-song", nextIndex: currentIndex + 1 };
      }

      if (repeatMode === REPEAT_MODES.OFF) {
        return { action: "stop" };
      }

      if (repeatMode === REPEAT_MODES.ALL) {
        if (isShuffled) {
          return {
            action: "reshuffle-and-restart",
            newQueue: shuffleNewQueue(),
          };
        } else {
          return { action: "restart", nextIndex: 0 };
        }
      }

      return { action: "stop" };
    },
    [repeatMode]
  );

  const reset = useCallback(() => {
    setRepeatMode(REPEAT_MODES.OFF);
  }, []);

  return {
    repeatMode,
    toggleRepeat,
    shouldRepeatCurrent,
    shouldRepeatQueue,
    getNextBehavior,
    reset,
  };
};

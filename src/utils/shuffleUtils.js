export const SHUFFLE_MODES = {
  OFF: "off",
  ON: "on",
};

export const STORAGE_KEYS = {
  SHUFFLE_MODE: "music_shuffle_mode",
};

export const saveShufflePreference = (isShuffled) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SHUFFLE_MODE,
      isShuffled ? SHUFFLE_MODES.ON : SHUFFLE_MODES.OFF
    );
  } catch (error) {
    console.warn("Could not save shuffle preference:", error);
  }
};

export const loadShufflePreference = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHUFFLE_MODE);
    return saved === SHUFFLE_MODES.ON;
  } catch (error) {
    console.warn("Could not load shuffle preference:", error);
    return false;
  }
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const findSongIndex = (queue, songId) => {
  return queue.findIndex((song) => song.id === songId);
};

export const getNextIndex = (currentIndex, queueLength, shouldLoop = true) => {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= queueLength) {
    return shouldLoop ? 0 : currentIndex;
  }
  return nextIndex;
};

export const getPreviousIndex = (
  currentIndex,
  queueLength,
  shouldLoop = true
) => {
  const prevIndex = currentIndex - 1;
  if (prevIndex < 0) {
    return shouldLoop ? queueLength - 1 : 0;
  }
  return prevIndex;
};

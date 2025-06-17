export const REPEAT_MODES = {
  OFF: "off",
  ALL: "all",
  ONE: "one",
};

export const STORAGE_KEYS = {
  REPEAT_MODE: "music_repeat_mode",
};

export const saveRepeatPreference = (repeatMode) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, repeatMode);
  } catch (error) {
    console.warn("Could not save repeat preference:", error);
  }
};

export const loadRepeatPreference = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REPEAT_MODE);
    return Object.values(REPEAT_MODES).includes(saved)
      ? saved
      : REPEAT_MODES.OFF;
  } catch (error) {
    console.warn("Could not load repeat preference:", error);
    return REPEAT_MODES.OFF;
  }
};

export const getRepeatButtonInfo = (repeatMode) => {
  switch (repeatMode) {
    case REPEAT_MODES.OFF:
      return {
        active: false,
        showOne: false,
        title: "Enable repeat",
      };
    case REPEAT_MODES.ALL:
      return {
        active: true,
        showOne: false,
        title: "Repeat all - click for repeat one",
      };
    case REPEAT_MODES.ONE:
      return {
        active: true,
        showOne: true,
        title: "Repeat one - click to disable repeat",
      };
    default:
      return {
        active: false,
        showOne: false,
        title: "Enable repeat",
      };
  }
};

import { TIMEOUTS } from "../constants/uploadLimits";

const durationCache = new Map();
const loadingPromises = new Map();

export const calculateAudioDuration = (audioUrl) => {
  return new Promise((resolve) => {
    if (!audioUrl || !audioUrl.startsWith("http")) {
      resolve("--:--");
      return;
    }

    if (durationCache.has(audioUrl)) {
      resolve(durationCache.get(audioUrl));
      return;
    }

    if (loadingPromises.has(audioUrl)) {
      loadingPromises.get(audioUrl).then(resolve);
      return;
    }

    const loadingPromise = new Promise((promiseResolve) => {
      const audio = new Audio();
      let timeoutId;

      const handleError = () => {
        const fallback = "--:--";
        durationCache.set(audioUrl, fallback);
        cleanup();
        promiseResolve(fallback);
      };

      const handleLoadedMetadata = () => {
        try {
          if (
            audio.duration &&
            !isNaN(audio.duration) &&
            isFinite(audio.duration)
          ) {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const formattedDuration = `${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`;
            durationCache.set(audioUrl, formattedDuration);
            cleanup();
            promiseResolve(formattedDuration);
          } else {
            handleError();
          }
        } catch (error) {
          handleError();
        }
      };

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("error", handleError);
        audio.src = "";
        loadingPromises.delete(audioUrl);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("error", handleError);

      timeoutId = setTimeout(handleError, 5000);

      try {
        audio.crossOrigin = "anonymous";
        audio.preload = "metadata";
        audio.src = audioUrl;
        audio.load();
      } catch (error) {
        handleError();
      }
    });

    loadingPromises.set(audioUrl, loadingPromise);
    loadingPromise.then(resolve);
  });
};

export const clearDurationCache = () => {
  durationCache.clear();
  loadingPromises.clear();
};

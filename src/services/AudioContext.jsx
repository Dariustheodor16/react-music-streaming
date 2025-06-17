import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useShuffleLogic, useRepeatLogic } from "../hooks/audio-hooks";
import { usePlayCount } from "../hooks/audio-hooks/usePlayCount";
import { useAuth } from "./auth/AuthContext";

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save ${key}:`, error);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (error) {
    console.warn(`Could not load ${key}:`, error);
    return defaultValue;
  }
};

const AudioProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef(null);

  const {
    isShuffled,
    toggleShuffle: shuffleToggle,
    shouldShuffleNewQueue,
    reset: resetShuffle,
  } = useShuffleLogic();

  const {
    repeatMode,
    toggleRepeat,
    getNextBehavior,
    reset: resetRepeat,
  } = useRepeatLogic();

  const {
    startPlayTracking,
    stopPlayTracking,
    getPlayCount,
    loadPlayCount,
    loadMultiplePlayCounts,
  } = usePlayCount();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    const savedShuffle = loadFromStorage("music_shuffle_mode", "off") === "on";
    const savedRepeat = loadFromStorage("music_repeat_mode", "off");

    if (savedShuffle) {
      shuffleToggle([], 0);
    }
  }, []);

  useEffect(() => {
    saveToStorage("music_shuffle_mode", isShuffled ? "on" : "off");
  }, [isShuffled]);

  useEffect(() => {
    saveToStorage("music_repeat_mode", repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleShuffle = () => {
    if (!queue.length) return;

    const result = shuffleToggle(queue, currentIndex);
    setQueue(result.newQueue);
    setCurrentIndex(result.newIndex);
  };

  const playSong = useCallback(
    (song, newQueue = []) => {
      if (!song.audioUrl) return;

      if (currentSong?.id) {
        stopPlayTracking(currentSong.id);
      }

      const queueToUse = newQueue.length > 0 ? newQueue : queue;
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = song.audioUrl;
        audio.load();
      }

      setCurrentSong(song);
      setQueue(queueToUse);
      setCurrentIndex(queueToUse.findIndex((s) => s.id === song.id));
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      const playWhenReady = () => {
        if (audio.readyState >= 2) {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              startPlayTracking(song.id);
            })
            .catch((error) => console.error("Error playing song:", error));
        } else {
          setTimeout(playWhenReady, 100);
        }
      };

      playWhenReady();

      if (currentUser) {
        const addToRecentlyPlayed = (songData) => {
          try {
            const key = `recentlyPlayed_${currentUser.uid}`;
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            const filtered = existing.filter((item) => item.id !== songData.id);
            const updated = [songData, ...filtered].slice(0, 20);

            localStorage.setItem(key, JSON.stringify(updated));
          } catch (error) {
            console.error("Error saving to recently played:", error);
          }
        };

        addToRecentlyPlayed(song);
      }
    },
    [queue, currentSong, startPlayTracking, stopPlayTracking]
  );

  const pauseSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (currentSong?.id) {
        stopPlayTracking(currentSong.id);
      }
    }
  }, [isPlaying, currentSong, stopPlayTracking]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopPlayTracking(currentSong.id);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          startPlayTracking(currentSong.id);
        })
        .catch((error) => console.error("Error playing song:", error));
    }
  }, [isPlaying, currentSong, startPlayTracking, stopPlayTracking]);

  const playNext = () => {
    if (queue.length === 0) return;

    const shuffleNewQueue = () => shouldShuffleNewQueue(queue);
    const behavior = getNextBehavior(
      currentIndex,
      queue.length,
      isShuffled,
      shuffleNewQueue
    );

    const audio = audioRef.current;

    if (currentSong?.id) {
      stopPlayTracking(currentSong.id);
    }

    switch (behavior.action) {
      case "repeat-current":
        audio.currentTime = 0;
        setCurrentTime(0);
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            startPlayTracking(currentSong.id);
          })
          .catch((error) => console.error("Error repeating song:", error));
        break;

      case "next-song":
        const nextSong = queue[behavior.nextIndex];
        setCurrentIndex(behavior.nextIndex);
        setCurrentSong(nextSong);
        audio.pause();
        audio.src = nextSong.audioUrl;
        audio.load();
        audio.currentTime = 0;
        setCurrentTime(0);

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            startPlayTracking(nextSong.id);
          })
          .catch((error) => console.error("Error playing next song:", error));
        break;

      case "restart":
        const firstSong = queue[0];
        setCurrentIndex(0);
        setCurrentSong(firstSong);
        audio.pause();
        audio.src = firstSong.audioUrl;
        audio.load();
        audio.currentTime = 0;
        setCurrentTime(0);

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            startPlayTracking(firstSong.id);
          })
          .catch((error) => console.error("Error restarting queue:", error));
        break;

      case "reshuffle-and-restart":
        const newShuffledQueue = behavior.newQueue;
        setQueue(newShuffledQueue);
        const firstShuffledSong = newShuffledQueue[0];
        setCurrentIndex(0);
        setCurrentSong(firstShuffledSong);
        audio.pause();
        audio.src = firstShuffledSong.audioUrl;
        audio.load();
        audio.currentTime = 0;
        setCurrentTime(0);

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            startPlayTracking(firstShuffledSong.id);
          })
          .catch((error) =>
            console.error("Error playing reshuffled queue:", error)
          );
        break;

      case "stop":
      default:
        setIsPlaying(false);
        audio.pause();
        break;
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    if (currentSong?.id) {
      stopPlayTracking(currentSong.id);
    }

    if (currentTime > 3) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        startPlayTracking(currentSong.id);
      }
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevSong = queue[prevIndex];
    setCurrentIndex(prevIndex);
    setCurrentSong(prevSong);

    const audio = audioRef.current;
    audio.pause();
    audio.src = prevSong.audioUrl;
    audio.load();
    audio.currentTime = 0;
    setCurrentTime(0);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        startPlayTracking(prevSong.id);
      })
      .catch((error) => console.error("Error playing previous song:", error));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = (e) => {
      console.error("Audio error occurred:", e);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {};

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentSong]);

  const seek = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time) && time >= 0 && time <= (audio.duration || 0)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = clampedVolume;
    }
  };

  const clearCurrentSong = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      audio.load();
    }

    if (currentSong?.id) {
      stopPlayTracking(currentSong.id);
    }

    setCurrentSong(null);
    setQueue([]);
    setCurrentIndex(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentSong, stopPlayTracking]);

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    currentIndex,
    isShuffled,
    repeatMode,
    playSong,
    pauseSong,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    clearCurrentSong,
    getPlayCount,
    loadPlayCount,
    loadMultiplePlayCounts,
    startPlayTracking,
    stopPlayTracking,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export { AudioProvider };

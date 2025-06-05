import { createContext, useContext, useState, useRef, useEffect } from "react";

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song, songQueue = []) => {
    const audio = audioRef.current;

    if (songQueue.length > 0) {
      setQueue(songQueue);
      const songIndex = songQueue.findIndex((s) => s.id === song.id);
      setCurrentIndex(songIndex >= 0 ? songIndex : 0);
    } else if (queue.length === 0) {
      setQueue([song]);
      setCurrentIndex(0);
    }
    setCurrentSong(song);
    audio.src = song.audioUrl;
    setCurrentTime(0);

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else if (currentSong) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      setCurrentIndex(nextIndex);
      setCurrentSong(nextSong);

      const audio = audioRef.current;
      audio.src = nextSong.audioUrl;
      setCurrentTime(0);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing next song:", error);
        });
    } else {
      const firstSong = queue[0];
      setCurrentIndex(0);
      setCurrentSong(firstSong);

      const audio = audioRef.current;
      audio.src = firstSong.audioUrl;
      setCurrentTime(0);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing first song:", error);
        });
    }
  };
  const playPrevious = () => {
    if (queue.length === 0) return;
    if (currentTime > 3) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      setCurrentIndex(prevIndex);
      setCurrentSong(prevSong);

      const audio = audioRef.current;
      audio.src = prevSong.audioUrl;
      setCurrentTime(0);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing previous song:", error);
        });
    } else {
      const audio = audioRef.current;
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      console.error("Audio error occurred");
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
      };
    }
  }, []);

  const seek = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time) && time >= 0 && time <= audio.duration) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const clearCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQueue([]);
    setCurrentIndex(0);
  };

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    currentIndex,
    playSong,
    pauseSong,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    clearCurrentSong,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
};

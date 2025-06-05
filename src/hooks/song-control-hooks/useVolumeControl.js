import { useState, useEffect } from "react";

export const useVolumeControl = (volume, setVolume) => {
  const [lastVolume, setLastVolume] = useState(0.7);

  useEffect(() => {
    if (volume > 0) {
      setLastVolume(volume);
    }
  }, [volume]);

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(lastVolume);
    } else {
      setVolume(0);
    }
  };

  const calculateVolumeFromEvent = (e, element) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    return Math.max(0, Math.min(1, percentage));
  };

  return {
    lastVolume,
    toggleMute,
    calculateVolumeFromEvent,
  };
};

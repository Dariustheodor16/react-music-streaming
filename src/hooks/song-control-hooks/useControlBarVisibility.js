import { useState, useEffect } from "react";

export const useControlBarVisibility = (currentSong) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!currentSong);
  }, [currentSong]);

  return { isVisible };
};

import { useState } from "react";

export const useLikeState = (initialLiked = false) => {
  const [liked, setLiked] = useState(initialLiked);
  const [brokenHover, setBrokenHover] = useState(false);

  const handleHeartClick = () => {
    if (liked && brokenHover) {
      setLiked(false);
      setBrokenHover(false);
    } else if (!liked) {
      setLiked(true);
    }
  };

  const handleMouseEnter = () => setBrokenHover(true);
  const handleMouseLeave = () => setBrokenHover(false);

  return {
    liked,
    brokenHover,
    handleHeartClick,
    handleMouseEnter,
    handleMouseLeave,
  };
};

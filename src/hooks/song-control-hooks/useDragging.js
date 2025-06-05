import { useState, useCallback } from "react";

export const useDragging = (onDrag, onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);

      const handleMouseMove = (e) => {
        if (onDrag) onDrag(e);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        if (onDragEnd) onDragEnd();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [onDrag, onDragEnd]
  );

  return {
    isDragging,
    handleMouseDown,
  };
};

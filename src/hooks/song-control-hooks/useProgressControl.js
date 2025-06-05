export const useProgressControl = (duration, seek) => {
  const calculateProgressFromEvent = (e, element) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    return percentage * duration;
  };

  const handleProgressClick = (e, isDragging) => {
    if (isDragging || !duration) return;

    const newTime = calculateProgressFromEvent(e, e.currentTarget);
    if (newTime >= 0 && newTime <= duration) {
      seek(newTime);
    }
  };

  return {
    calculateProgressFromEvent,
    handleProgressClick,
  };
};

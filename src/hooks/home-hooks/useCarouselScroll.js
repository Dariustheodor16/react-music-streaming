import { useState, useEffect, useRef } from "react";

export const useCarouselScroll = (scrollKey, items = []) => {
  const carouselRef = useRef(null);
  const [scrollStates, setScrollStates] = useState({});

  const checkScrollPosition = () => {
    if (!carouselRef.current || !scrollKey) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

    setScrollStates((prev) => ({
      ...prev,
      [scrollKey]: { left: canScrollLeft, right: canScrollRight },
    }));
  };

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = 524;
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (items.length > 0) {
        checkScrollPosition();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items.length, scrollKey]);

  return {
    carouselRef,
    scrollStates,
    checkScrollPosition,
    scrollCarousel,
  };
};

import { useState, useEffect, useRef } from "react";
import ColorThief from "colorthief";

export const useColorExtraction = (imageUrl) => {
  const [gradient, setGradient] = useState(
    "linear-gradient(90deg, #3a3a60 0%, #232323 100%)"
  );
  const imgRef = useRef();
  const colorThief = new ColorThief();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const extractPalette = async () => {
      try {
        if (!img.complete) return;
        let palette = await colorThief.getPalette(img, 5);
        while (palette.length < 5) palette.push(palette[palette.length - 1]);
        const [c1, c2, c3, c4, c5] = palette.map(
          (c) => `rgb(${c[0]},${c[1]},${c[2]})`
        );
        setGradient(
          `linear-gradient(120deg, ${c1} 0%, ${c2} 100%),
           radial-gradient(circle at 80% 20%, ${c3} 0%, transparent 70%),
           linear-gradient(240deg, ${c4} 0%, ${c5} 100%)`
        );
      } catch {
        setGradient(
          `linear-gradient(120deg, #3a3a60 0%, #232323 100%),
           radial-gradient(circle at 80% 20%, #232323 0%, transparent 70%),
           linear-gradient(240deg, #232323 0%, #3a3a60 100%)`
        );
      }
    };

    img.addEventListener("load", extractPalette);
    if (img.complete) extractPalette();
    return () => img.removeEventListener("load", extractPalette);
  }, [imageUrl]);

  return { gradient, imgRef };
};

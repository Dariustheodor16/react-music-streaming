import { useState } from "react";

export const useImagePreview = (onUpload) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = (url) => {
    setImageUrl(url);
    if (onUpload) onUpload(url);
  };

  const resetImage = () => {
    setImageUrl("");
  };

  return {
    imageUrl,
    handleImageUpload,
    resetImage,
  };
};

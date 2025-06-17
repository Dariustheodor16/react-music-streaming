import { useState, useRef } from "react";

export const useImageUpload = (setLocalError) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const validateImageFile = (file) => {
    const supportedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!supportedImageTypes.includes(file.type)) {
      setLocalError(
        "Please select a JPG, PNG, or GIF image file. WebP files are not supported."
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Image file must be less than 5MB.");
      return false;
    }

    return true;
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!validateImageFile(file)) return;

      setLocalError("");
      setImageUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.type.startsWith("image/")) {
        if (!validateImageFile(file)) return;

        setLocalError("");
        setImageUrl(URL.createObjectURL(file));
        setImageFile(file);
      }
    }
  };

  return {
    imageUrl,
    imageFile,
    isDragging,
    fileInputRef,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

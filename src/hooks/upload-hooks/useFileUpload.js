import { useState } from "react";
import { UPLOAD_LIMITS } from "../../constants/uploadLimits";

export const useFileUpload = (
  allowedTypes,
  maxSize = UPLOAD_LIMITS.MAX_AUDIO_SIZE
) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type");
      return false;
    }

    const sizeLimit = file.type.startsWith("image/")
      ? UPLOAD_LIMITS.MAX_IMAGE_SIZE
      : UPLOAD_LIMITS.MAX_AUDIO_SIZE;

    if (file.size > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024);
      setError(`File size must be less than ${limitMB}MB`);
      return false;
    }

    if (file.name.length > UPLOAD_LIMITS.MAX_FILENAME_LENGTH) {
      setError("Filename is too long");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File type not allowed");
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSize) {
        setError("File size too large");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File type not allowed");
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSize) {
        setError("File size too large");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const reset = () => {
    setFile(null);
    setError("");
    setIsDragging(false);
  };

  return {
    file,
    error,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    reset,
  };
};

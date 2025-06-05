import { useState } from "react";

export const useFileUpload = (allowedTypes, maxSize = 10 * 1024 * 1024) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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

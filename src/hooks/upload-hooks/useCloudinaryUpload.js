import { useState } from "react";

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file, uploadPreset, resourceType = "image") => {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dky8gzzrx/${resourceType}/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      return data.secure_url;
    } catch (err) {
      setError("Upload failed. Please try again.");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};

import { useState } from "react";
import PrimaryButton from "../ui/Buttons/PrimaryButton";
import { CLOUDINARY_CONFIG } from "../../constants/uploadLimits";

const CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET_IMAGES;
const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.CLOUD_NAME;

const CloudinaryImageUpload = ({
  onUpload,
  label = "Upload Image",
  disabled = false,
  style = {},
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        if (onUpload) onUpload(data.secure_url);
      } else {
        setError("Upload failed.");
      }
    } catch (err) {
      setError("Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading || disabled}
        style={{ marginBottom: 8 }}
      />
      <PrimaryButton
        onClick={handleUpload}
        disabled={uploading || !file || disabled}
        style={{ marginBottom: 8 }}
      >
        {uploading ? "Uploading..." : label}
      </PrimaryButton>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          style={{ maxWidth: 200, marginBottom: 8, borderRadius: 8 }}
        />
      )}
      {error && <span style={{ color: "#ff4343" }}>{error}</span>}
    </div>
  );
};

export default CloudinaryImageUpload;

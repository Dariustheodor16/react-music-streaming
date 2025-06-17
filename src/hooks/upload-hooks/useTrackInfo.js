import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import { firestore } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { CLOUDINARY_CONFIG } from "../../constants/uploadLimits";

const CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_CONFIG.UPLOAD_PRESET_AUDIO;
const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG.CLOUD_NAME;

export const useTrackInfo = (
  audioFile,
  trackNumber,
  totalTracks,
  albumData,
  existingAlbumId,
  isMultiUpload,
  onTrackComplete
) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [trackTitle, setTrackTitle] = useState(
    audioFile && audioFile.name ? audioFile.name.replace(/\.[^/.]+$/, "") : ""
  );
  const [artists, setArtists] = useState([]);
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file, resourceType = "video") => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadPreset = file.type.startsWith("image/")
      ? CLOUDINARY_CONFIG.UPLOAD_PRESET_IMAGES
      : CLOUDINARY_CONFIG.UPLOAD_PRESET_AUDIO;
    formData.append("upload_preset", uploadPreset);

    let actualResourceType = resourceType;
    if (file.type.startsWith("audio/")) {
      actualResourceType = "video";
    } else if (file.type.startsWith("image/")) {
      actualResourceType = "image";
    }

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${actualResourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(`Upload failed: ${data.error?.message || res.status}`);
      }

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed - no URL returned");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload file. Please try again.");
    }
  };

  const handleSubmit = async (imageFile) => {
    setLocalError("");
    if (
      !trackTitle.trim() ||
      artists.length === 0 ||
      !genre.trim() ||
      !description.trim() ||
      !audioFile ||
      (!isMultiUpload && !imageFile)
    ) {
      setLocalError("Please fill in all fields and select an image.");
      return;
    }
    if (!currentUser) {
      setLocalError("You must be logged in to upload.");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl;
      if (isMultiUpload && trackNumber === 1 && albumData?.albumCoverFile) {
        uploadedImageUrl = await uploadToCloudinary(
          albumData.albumCoverFile,
          "image"
        );
      } else if (isMultiUpload) {
        uploadedImageUrl = albumData?.uploadedImageUrl || "/mini-logo.svg";
      } else {
        uploadedImageUrl = await uploadToCloudinary(imageFile, "image");
      }

      const uploadedAudioUrl = await uploadToCloudinary(audioFile, "video");

      let albumId = existingAlbumId;
      if (isMultiUpload && !existingAlbumId) {
        const albumDoc = await addDoc(collection(firestore, "albums"), {
          name: albumData.name,
          type: albumData.type,
          artist: albumData.artist,
          artists: albumData.artists?.map((artist) => artist.username) || [
            albumData.artist,
          ],
          releaseDate: albumData.releaseDate,
          imageUrl: uploadedImageUrl,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        });

        albumId = albumDoc.id;
        albumData.uploadedImageUrl = uploadedImageUrl;
      }

      const artistsForDB = artists.map((artist) => artist.username);

      await addDoc(collection(firestore, "tracks"), {
        title: trackTitle,
        artists: artistsForDB,
        genre,
        description,
        imageUrl: uploadedImageUrl,
        audioUrl: uploadedAudioUrl,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        albumId: albumId,
        trackNumber: trackNumber,
      });

      setLoading(false);

      if (isMultiUpload && onTrackComplete) {
        onTrackComplete(trackNumber === 1 ? albumId : null);
      } else {
        const timestamp = Date.now();
        navigate(`/profile?refresh=${timestamp}`);
      }
    } catch (err) {
      setLoading(false);
      setLocalError("Upload failed. Please try again.");
      console.error("Upload error:", err);
    }
  };

  useEffect(() => {
    if (audioFile && audioFile.name) {
      setTrackTitle(audioFile.name.replace(/\.[^/.]+$/, ""));
    }
  }, [audioFile]);

  return {
    trackTitle,
    setTrackTitle,
    artists,
    setArtists,
    genre,
    setGenre,
    description,
    setDescription,
    localError,
    setLocalError,
    loading,
    handleSubmit,
  };
};

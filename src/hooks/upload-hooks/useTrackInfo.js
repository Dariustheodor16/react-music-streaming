import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";

const GENRES = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Folk",
  "Blues",
  "Punk",
  "Metal",
  "Indie",
  "Alternative",
];

export const useTrackInfo = (currentUser) => {
  const [trackData, setTrackData] = useState({
    title: "",
    artists: "",
    description: "",
    genre: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const updateTrackData = (field, value) => {
    setTrackData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreSelect = (genre) => {
    updateTrackData("genre", genre);
    setShowGenreDropdown(false);
  };

  const validateForm = () => {
    if (!trackData.title.trim()) return "Title is required";
    if (!trackData.artists.trim()) return "Artist is required";
    if (!imageUrl) return "Cover image is required";
    if (!audioUrl) return "Audio file is required";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(firestore, "tracks"), {
        title: trackData.title.trim(),
        artists: trackData.artists.split(",").map((artist) => artist.trim()),
        description: trackData.description.trim(),
        genre: trackData.genre,
        imageUrl,
        audioUrl,
        userId: currentUser.uid,
        createdAt: new Date(),
        plays: 0,
        likes: 0,
      });

      // Reset form
      setTrackData({ title: "", artists: "", description: "", genre: "" });
      setImageUrl("");
      setAudioUrl("");

      return true;
    } catch (err) {
      setError("Failed to upload track. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    trackData,
    updateTrackData,
    imageUrl,
    setImageUrl,
    audioUrl,
    setAudioUrl,
    loading,
    error,
    setError,
    showGenreDropdown,
    setShowGenreDropdown,
    genres: GENRES,
    handleGenreSelect,
    handleSubmit,
    validateForm,
  };
};

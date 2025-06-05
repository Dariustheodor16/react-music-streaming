import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../services/firebase";

export const useSongs = (userId) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAudioDuration = (audioUrl) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      });
      audio.addEventListener("error", () => {
        resolve("--:--");
      });
      audio.src = audioUrl;
    });
  };

  useEffect(() => {
    const fetchSongs = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "tracks"),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const fetchedSongs = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();

          let duration = "3:45";
          if (data.audioUrl) {
            try {
              duration = await getAudioDuration(data.audioUrl);
            } catch (error) {
              console.warn("Could not get duration for", data.title, error);
            }
          }

          fetchedSongs.push({
            id: doc.id,
            name: data.title,
            artist: data.artists ? data.artists.join(", ") : "Unknown Artist",
            duration: duration,
            plays: Math.floor(Math.random() * 10000),
            image: data.imageUrl || "/mini-logo.svg",
            audioUrl: data.audioUrl,
            genre: data.genre,
            description: data.description,
          });
        }

        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [userId]);

  return { songs, loading, error, setSongs };
};

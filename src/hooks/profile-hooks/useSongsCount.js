import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { firestore } from "../../services/firebase";

export const useSongsCount = (userId, initialCount = 0) => {
  const [songsCount, setSongsCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongsCount = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "tracks"),
          where("userId", "==", userId)
        );
        const snapshot = await getCountFromServer(q);
        setSongsCount(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching songs count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongsCount();
  }, [userId]);

  return { songsCount, loading };
};

import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";

export const useRecentlyPlayed = () => {
  const { currentUser } = useAuth();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setRecentlyPlayed([]);
      return;
    }
    const getRecentlyPlayed = () => {
      try {
        const stored = localStorage.getItem(
          `recentlyPlayed_${currentUser.uid}`
        );
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error getting recently played:", error);
        return [];
      }
    };

    setRecentlyPlayed(getRecentlyPlayed());
    const handleStorageChange = (e) => {
      if (e.key === `recentlyPlayed_${currentUser.uid}`) {
        setRecentlyPlayed(getRecentlyPlayed());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  return { recentlyPlayed };
};

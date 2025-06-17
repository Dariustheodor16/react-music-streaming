import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";

export const useArtistManager = (artists, setArtists) => {
  const { currentUser } = useAuth();
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeWithCurrentUser = async () => {
      if (!currentUser || hasInitialized || artists.length > 0) return;

      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { firestore } = await import("../../services/firebase");

        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentUserArtist = {
            id: currentUser.uid,
            username: userData.username,
            displayName: userData.displayName || currentUser.displayName,
            photoURL: userData.photoURL || currentUser.photoURL,
          };

          setArtists([currentUserArtist]);
        } else {
          const currentUserArtist = {
            id: currentUser.uid,
            username: currentUser.email?.split("@")[0] || "user",
            displayName: currentUser.displayName || "Current User",
            photoURL: currentUser.photoURL,
          };

          setArtists([currentUserArtist]);
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
        const currentUserArtist = {
          id: currentUser.uid,
          username: currentUser.email?.split("@")[0] || "user",
          displayName: currentUser.displayName || "Current User",
          photoURL: currentUser.photoURL,
        };

        setArtists([currentUserArtist]);
      } finally {
        setHasInitialized(true);
      }
    };

    initializeWithCurrentUser();
  }, [currentUser, hasInitialized, artists.length, setArtists]);

  const handleArtistSelect = (user) => {
    if (!artists.some((artist) => artist.username === user.username)) {
      setArtists([...artists, user]);
    }
    setShowArtistSearch(false);
  };

  const handleRemoveArtist = (username) => {
    if (artists.length === 1 && currentUser) {
      const userToRemove = artists.find(
        (artist) => artist.username === username
      );
      if (userToRemove && userToRemove.id === currentUser.uid) {
        return;
      }
    }

    setArtists(artists.filter((artist) => artist.username !== username));
  };

  return {
    showArtistSearch,
    setShowArtistSearch,
    handleArtistSelect,
    handleRemoveArtist,
  };
};

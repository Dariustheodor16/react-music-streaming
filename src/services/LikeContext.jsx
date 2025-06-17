import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { likeCountService } from "./api/likeCountService";
import { notificationService } from "./api/notificationService";
import { trackService } from "./api/trackService";
import { albumService } from "./api/albumService";

const LikeContext = createContext();

export const useLikes = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikes must be used within LikeProvider");
  }
  return context;
};

export const LikeProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [likedAlbums, setLikedAlbums] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadLikedItems = async () => {
      if (!currentUser) {
        setLikedSongs(new Set());
        setLikedAlbums(new Set());
        setLikeCounts(new Map());
        setLoading(false);
        return;
      }

      try {
        const songsQuery = query(
          collection(firestore, "likes"),
          where("userId", "==", currentUser.uid),
          where("type", "==", "song")
        );
        const songsSnapshot = await getDocs(songsQuery);
        const songs = new Set();
        songsSnapshot.forEach((doc) => {
          songs.add(doc.data().itemId);
        });

        const albumsQuery = query(
          collection(firestore, "likes"),
          where("userId", "==", currentUser.uid),
          where("type", "==", "album")
        );
        const albumsSnapshot = await getDocs(albumsQuery);
        const albums = new Set();
        albumsSnapshot.forEach((doc) => {
          albums.add(doc.data().itemId);
        });

        setLikedSongs(songs);
        setLikedAlbums(albums);
      } catch (error) {
        console.error("Error loading liked items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLikedItems();
  }, [currentUser]);

  const toggleLike = async (itemId, type = "song") => {
    if (!currentUser) return;

    const isLiked =
      type === "song" ? likedSongs.has(itemId) : likedAlbums.has(itemId);

    try {
      if (isLiked) {
        await deleteDoc(
          doc(firestore, "likes", `${currentUser.uid}_${itemId}_${type}`)
        );

        await likeCountService.decrementLikeCount(itemId, type);

        if (type === "song") {
          setLikedSongs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        } else {
          setLikedAlbums((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        }

        const key = `${itemId}_${type}`;
        setLikeCounts((prev) => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(key) || 0;
          newMap.set(key, Math.max(0, currentCount - 1));
          return newMap;
        });
      } else {
        await setDoc(
          doc(firestore, "likes", `${currentUser.uid}_${itemId}_${type}`),
          {
            userId: currentUser.uid,
            itemId: itemId,
            type: type,
            createdAt: new Date(),
          }
        );

        await likeCountService.incrementLikeCount(itemId, type);

        if (type === "song") {
          setLikedSongs((prev) => new Set(prev).add(itemId));
        } else {
          setLikedAlbums((prev) => new Set(prev).add(itemId));
        }

        const key = `${itemId}_${type}`;
        setLikeCounts((prev) => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(key) || 0;
          newMap.set(key, currentCount + 1);
          return newMap;
        });

        try {
          let itemData;
          let itemOwnerId;

          if (type === "song") {
            itemData = await trackService.getTrackById(itemId);
            itemOwnerId = itemData?.userId;
          } else {
            itemData = await albumService.getAlbumById(itemId);
            itemOwnerId = itemData?.userId;
          }

          if (itemOwnerId && itemOwnerId !== currentUser.uid) {
            await notificationService.createNotification({
              userId: itemOwnerId,
              type: "like",
              fromUserId: currentUser.uid,
              itemId: itemId,
              itemType: type,
              itemTitle: itemData?.title || itemData?.name || "Unknown",
            });
          }
        } catch (error) {
          console.error("Error creating like notification:", error);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isLiked = (itemId, type = "song") => {
    return type === "song" ? likedSongs.has(itemId) : likedAlbums.has(itemId);
  };

  const getLikeCount = async (itemId, type = "song") => {
    const key = `${itemId}_${type}`;

    if (likeCounts.has(key)) {
      return likeCounts.get(key);
    }

    try {
      const count = await likeCountService.getLikeCount(itemId, type);
      setLikeCounts((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, count);
        return newMap;
      });
      return count;
    } catch (error) {
      console.error("Error fetching like count:", error);
      return 0;
    }
  };

  const preloadLikeCounts = async (items) => {
    try {
      const counts = await likeCountService.getMultipleLikeCounts(items);
      setLikeCounts((prev) => {
        const newMap = new Map(prev);
        counts.forEach((count, key) => {
          newMap.set(key, count);
        });
        return newMap;
      });
    } catch (error) {
      console.error("Error preloading like counts:", error);
    }
  };

  const value = {
    likedSongs,
    likedAlbums,
    loading,
    toggleLike,
    isLiked,
    getLikeCount,
    preloadLikeCounts,
  };

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
};

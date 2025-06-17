import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const likeService = {
  async getUserLikes(userId) {
    try {
      const q = query(
        collection(firestore, "likes"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);

      const likes = {
        songs: new Set(),
        albums: new Set(),
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.type === "song") {
          likes.songs.add(data.itemId);
        } else if (data.type === "album") {
          likes.albums.add(data.itemId);
        }
      });

      return likes;
    } catch (error) {
      console.error("Error fetching user likes:", error);
      throw error;
    }
  },
  async addLike(userId, itemId, type) {
    try {
      await setDoc(doc(firestore, "likes", `${userId}_${itemId}_${type}`), {
        userId,
        itemId,
        type,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding like:", error);
      throw error;
    }
  },
  async removeLike(userId, itemId, type) {
    try {
      await deleteDoc(doc(firestore, "likes", `${userId}_${itemId}_${type}`));
    } catch (error) {
      console.error("Error removing like:", error);
      throw error;
    }
  },
};

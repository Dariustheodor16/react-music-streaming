import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const likeCountService = {
  async getLikeCount(itemId, type = "song") {
    try {
      const docRef = doc(firestore, "likeCounts", `${itemId}_${type}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().count || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error getting like count:", error);
      return 0;
    }
  },

  async incrementLikeCount(itemId, type = "song") {
    try {
      const docRef = doc(firestore, "likeCounts", `${itemId}_${type}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          count: increment(1),
          updatedAt: new Date(),
        });
      } else {
        await setDoc(docRef, {
          itemId,
          type,
          count: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error incrementing like count:", error);
      throw error;
    }
  },

  async decrementLikeCount(itemId, type = "song") {
    try {
      const docRef = doc(firestore, "likeCounts", `${itemId}_${type}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentCount = docSnap.data().count || 0;
        const newCount = Math.max(0, currentCount - 1);

        await updateDoc(docRef, {
          count: newCount,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error decrementing like count:", error);
      throw error;
    }
  },

  async getMultipleLikeCounts(items) {
    try {
      const counts = new Map();

      for (const { itemId, type } of items) {
        const count = await this.getLikeCount(itemId, type);
        counts.set(`${itemId}_${type}`, count);
      }

      return counts;
    } catch (error) {
      console.error("Error getting multiple like counts:", error);
      return new Map();
    }
  },

  async initializeLikeCount(itemId, type = "song") {
    try {
      const docRef = doc(firestore, "likeCounts", `${itemId}_${type}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          itemId,
          type,
          count: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error initializing like count:", error);
    }
  },
};

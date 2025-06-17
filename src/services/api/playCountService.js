import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const playCountService = {
  async getPlayCount(songId) {
    try {
      const { trackService } = await import("./trackService");
      try {
        await trackService.getTrackById(songId);
      } catch (error) {
        return 0;
      }

      const docRef = doc(firestore, "playCounts", songId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().count || 0;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching play count:", error);
      return 0;
    }
  },

  async getMultiplePlayCounts(songIds) {
    try {
      const counts = new Map();

      for (const songId of songIds) {
        const count = await this.getPlayCount(songId);
        counts.set(songId, count);
      }

      return counts;
    } catch (error) {
      console.error("Error getting multiple play counts:", error);
      return new Map();
    }
  },

  async canUserPlay(userId, songId) {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const q = query(
        collection(firestore, "userPlays"),
        where("userId", "==", userId),
        where("songId", "==", songId),
        where("timestamp", ">=", oneHourAgo),
        orderBy("timestamp", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);
      return snapshot.size < 5;
    } catch (error) {
      console.error("Error checking user play limit:", error);
      return false;
    }
  },

  async recordPlay(songId, userId) {
    try {
      const canPlay = await this.canUserPlay(userId, songId);
      if (!canPlay) {
        return { success: false, reason: "rate_limit" };
      }

      const now = new Date();
      const playCountRef = doc(firestore, "playCounts", songId);
      const playCountSnap = await getDoc(playCountRef);

      if (playCountSnap.exists()) {
        await updateDoc(playCountRef, {
          count: increment(1),
          lastPlayed: now,
          updatedAt: now,
        });
      } else {
        await setDoc(playCountRef, {
          songId,
          count: 1,
          lastPlayed: now,
          createdAt: now,
          updatedAt: now,
        });
      }

      const userPlayRef = doc(
        firestore,
        "userPlays",
        `${userId}_${songId}_${now.getTime()}`
      );
      await setDoc(userPlayRef, {
        userId,
        songId,
        timestamp: now,
      });

      return { success: true };
    } catch (error) {
      console.error("Error recording play:", error);
      return { success: false, reason: "error" };
    }
  },

  async initializePlayCount(songId) {
    try {
      const docRef = doc(firestore, "playCounts", songId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          songId,
          count: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error initializing play count:", error);
    }
  },

  async getMultiplePlayCounts(trackIds) {
    try {
      if (!trackIds || trackIds.length === 0) {
        return new Map();
      }

      const playCountsMap = new Map();

      const directLookupPromises = trackIds.map(async (trackId) => {
        try {
          const docRef = doc(firestore, "playCounts", trackId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const count = docSnap.data().count || 0;
            playCountsMap.set(trackId, count);
          } else {
            playCountsMap.set(trackId, 0);
          }
        } catch (error) {
          console.warn(`Error getting play count for ${trackId}:`, error);
          playCountsMap.set(trackId, 0);
        }
      });

      await Promise.all(directLookupPromises);

      return playCountsMap;
    } catch (error) {
      console.error("Error fetching multiple play counts:", error);
      return new Map();
    }
  },
};

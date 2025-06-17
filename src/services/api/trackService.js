import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const trackService = {
  async getAllTracks() {
    try {
      const q = query(
        collection(firestore, "tracks"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const tracks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enhancedTracks = await Promise.all(
        tracks.map(async (track) => {
          let displayName = track.artist || "Unknown Artist";
          if (
            track.artists &&
            Array.isArray(track.artists) &&
            track.artists.length > 0
          ) {
            displayName = track.artists.join(", ");
          }
          if (
            track.uploadedBy &&
            (!track.artist || track.artist === "Unknown Artist")
          ) {
            try {
              const { userService } = await import("./userService");
              const userData = await userService.getUserById(track.uploadedBy);
              if (userData) {
                displayName =
                  userData.displayName || userData.username || "Unknown Artist";
              }
            } catch (error) {
              console.warn(
                `Could not fetch user data for track ${track.id}:`,
                error
              );
            }
          }

          return {
            ...track,
            artist: displayName,
            artists: track.artists || [displayName],
          };
        })
      );

      return enhancedTracks;
    } catch (error) {
      console.error("Error fetching all tracks:", error);
      return [];
    }
  },

  async getTracksByUserId(userId) {
    try {
      const q = query(
        collection(firestore, "tracks"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user tracks:", error);
      throw error;
    }
  },

  async getTracksByIds(trackIds) {
    try {
      if (trackIds.length === 0) return [];

      const tracks = [];
      const q = query(collection(firestore, "tracks"));
      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        if (trackIds.includes(doc.id)) {
          const data = doc.data();
          let duration = data.duration || "--:--";

          tracks.push({
            id: doc.id,
            ...data,
            duration,
          });
        }
      }

      return tracks;
    } catch (error) {
      console.error("Error fetching tracks by IDs:", error);
      throw error;
    }
  },

  async getTracksByAlbumId(albumId) {
    try {
      const q = query(
        collection(firestore, "tracks"),
        where("albumId", "==", albumId),
        orderBy("trackNumber")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        duration: doc.data().duration || "--:--",
      }));
    } catch (error) {
      console.error("Error fetching album tracks:", error);
      throw error;
    }
  },

  async getTrackById(trackId) {
    try {
      const docRef = doc(firestore, "tracks", trackId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Track not found");
      }
    } catch (error) {
      console.error("Error fetching track:", error);
      throw error;
    }
  },

  async createTrack(trackData) {
    try {
      const docRef = await addDoc(collection(firestore, "tracks"), {
        ...trackData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating track:", error);
      throw error;
    }
  },

  async updateTrack(trackId, updates) {
    try {
      const trackRef = doc(firestore, "tracks", trackId);
      await updateDoc(trackRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating track:", error);
      throw error;
    }
  },

  async deleteTrack(trackId, skipAlbumCleanup = false) {
    try {
      const trackDoc = await getDoc(doc(firestore, "tracks", trackId));
      if (!trackDoc.exists()) {
        throw new Error("Track not found");
      }

      const trackData = trackDoc.data();
      const albumId = trackData.albumId;

      await deleteDoc(doc(firestore, "tracks", trackId));

      if (albumId && !skipAlbumCleanup) {
        try {
          const remainingTracks = await this.getTracksByAlbumId(albumId);

          if (!remainingTracks || remainingTracks.length === 0) {
            await deleteDoc(doc(firestore, "albums", albumId));
          }
        } catch (error) {
          console.error("Error checking/deleting empty album:", error);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting track:", error);
      throw error;
    }
  },

  async searchTracks(searchTerm, limitCount = 10) {
    try {
      const searchLower = searchTerm.toLowerCase();
      const titleQuery = query(
        collection(firestore, "tracks"),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff"),
        limit(limitCount * 2)
      );

      const titleLowerQuery = query(
        collection(firestore, "tracks"),
        where("title", ">=", searchLower),
        where("title", "<=", searchLower + "\uf8ff"),
        limit(limitCount * 2)
      );

      const [titleSnapshot, titleLowerSnapshot] = await Promise.all([
        getDocs(titleQuery),
        getDocs(titleLowerQuery),
      ]);

      const tracksMap = new Map();

      [...titleSnapshot.docs, ...titleLowerSnapshot.docs].forEach((doc) => {
        const data = doc.data();
        const title = data.title?.toLowerCase() || "";

        if (title.includes(searchLower)) {
          tracksMap.set(doc.id, {
            id: doc.id,
            ...data,
            duration: data.duration || "--:--",
          });
        }
      });

      const allTracks = await this.getAllTracks();
      allTracks.forEach((track) => {
        if (tracksMap.size >= limitCount * 2) return;

        const artistsText = track.artists?.join(" ").toLowerCase() || "";
        if (artistsText.includes(searchLower) && !tracksMap.has(track.id)) {
          tracksMap.set(track.id, {
            ...track,
            duration: track.duration || "--:--",
          });
        }
      });

      return Array.from(tracksMap.values()).slice(0, limitCount);
    } catch (error) {
      console.error("Error searching tracks:", error);
      throw error;
    }
  },

  async getTracksByGenre(genre, limitCount = 12) {
    try {
      let q = query(
        collection(firestore, "tracks"),
        where("genre", "==", genre),
        limit(limitCount)
      );

      let querySnapshot = await getDocs(q);
      let tracks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (tracks.length === 0) {
        const allTracks = await this.getAllTracks();
        tracks = allTracks
          .filter((track) => track.genre?.toLowerCase() === genre.toLowerCase())
          .slice(0, limitCount);
      }

      return tracks;
    } catch (error) {
      console.error("Error fetching tracks by genre:", error);

      try {
        const allTracks = await this.getAllTracks();
        const filteredTracks = allTracks
          .filter((track) => track.genre?.toLowerCase() === genre.toLowerCase())
          .slice(0, limitCount);

        return filteredTracks;
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return [];
      }
    }
  },

  async getTracksByArtist(artistName, limitCount = 5) {
    try {
      const q = query(
        collection(firestore, "tracks"),
        where("artist", "==", artistName),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching tracks by artist:", error);
      return [];
    }
  },
};

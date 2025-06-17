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
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const albumService = {
  async getAllAlbums() {
    try {
      const q = query(collection(firestore, "albums"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching albums:", error);
      throw error;
    }
  },

  async getAlbumsByUserId(userId) {
    try {
      const q = query(
        collection(firestore, "albums"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user albums:", error);
      throw error;
    }
  },

  async getAlbumById(albumId) {
    try {
      const docRef = doc(firestore, "albums", albumId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Album not found");
      }
    } catch (error) {
      console.error("Error fetching album:", error);
      throw error;
    }
  },

  async getAlbumsByIds(albumIds) {
    try {
      if (albumIds.length === 0) return [];

      const albums = [];
      const q = query(collection(firestore, "albums"));
      const snapshot = await getDocs(q);

      snapshot.docs.forEach((doc) => {
        if (albumIds.includes(doc.id)) {
          albums.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });

      return albums;
    } catch (error) {
      console.error("Error fetching albums by IDs:", error);
      throw error;
    }
  },

  async createAlbum(albumData) {
    try {
      const docRef = await addDoc(collection(firestore, "albums"), {
        ...albumData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating album:", error);
      throw error;
    }
  },

  async updateAlbum(albumId, updates) {
    try {
      const albumRef = doc(firestore, "albums", albumId);
      await updateDoc(albumRef, {
        ...updates,
        updatedAt: new Date(),
      });

      if (updates.imageUrl) {
        const { trackService } = await import("./trackService");
        const albumTracks = await trackService.getTracksByAlbumId(albumId);

        for (const track of albumTracks) {
          try {
            await trackService.updateTrack(track.id, {
              imageUrl: updates.imageUrl,
            });
          } catch (error) {
            console.error(`Error updating track ${track.id} image:`, error);
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating album:", error);
      throw error;
    }
  },

  async deleteAlbum(albumId) {
    try {
      const albumDoc = await getDoc(doc(firestore, "albums", albumId));
      if (!albumDoc.exists()) {
        throw new Error("Album not found");
      }

      const albumData = albumDoc.data();
      const { trackService } = await import("./trackService");
      const albumTracks = await trackService.getTracksByAlbumId(albumId);

      if (albumTracks && albumTracks.length > 0) {
        for (const track of albumTracks) {
          try {
            await deleteDoc(doc(firestore, "tracks", track.id));
            console.log(`Deleted track: ${track.title}`);
          } catch (error) {
            console.error(`Error deleting track ${track.id}:`, error);
          }
        }
      }

      await deleteDoc(doc(firestore, "albums", albumId));
      console.log(`Deleted album: ${albumId}`);

      return { success: true };
    } catch (error) {
      console.error("Error deleting album:", error);
      throw error;
    }
  },

  async searchAlbums(searchTerm, limitCount = 10) {
    try {
      const searchLower = searchTerm.toLowerCase();
      const allAlbums = await this.getAllAlbums();

      const matchingAlbums = allAlbums.filter((album) => {
        const nameMatch = album.name?.toLowerCase().includes(searchLower);
        const artistMatch = album.artist?.toLowerCase().includes(searchLower);
        return nameMatch || artistMatch;
      });

      return matchingAlbums.slice(0, limitCount);
    } catch (error) {
      console.error("Error searching albums:", error);
      throw error;
    }
  },

  async searchAlbumsByType(searchTerm, type, limitCount = 10) {
    try {
      const searchLower = searchTerm.toLowerCase();
      const typeQuery = query(
        collection(firestore, "albums"),
        where("type", "==", type)
      );

      const snapshot = await getDocs(typeQuery);

      const filteredAlbums = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((album) => {
          const nameMatch = album.name?.toLowerCase().includes(searchLower);
          const artistMatch = album.artist?.toLowerCase().includes(searchLower);
          return nameMatch || artistMatch;
        })
        .slice(0, limitCount);

      return filteredAlbums;
    } catch (error) {
      console.error(`Error searching ${type}s:`, error);
      throw error;
    }
  },
};

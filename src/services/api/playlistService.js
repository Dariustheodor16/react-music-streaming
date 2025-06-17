import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const playlistService = {
  async createPlaylist(userId, playlistData) {
    try {
      const docRef = await addDoc(collection(firestore, "playlists"), {
        ...playlistData,
        userId,
        songIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  },

  async getPlaylistsByUserId(userId) {
    try {
      const q = query(
        collection(firestore, "playlists"),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw error;
    }
  },

  async getPlaylistById(playlistId) {
    try {
      const docRef = doc(firestore, "playlists", playlistId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Playlist not found");
      }
    } catch (error) {
      console.error("Error fetching playlist:", error);
      throw error;
    }
  },

  async addSongToPlaylist(playlistId, songId) {
    try {
      const playlist = await this.getPlaylistById(playlistId);

      if (playlist.songIds && playlist.songIds.includes(songId)) {
        throw new Error("Song already exists in this playlist");
      }

      const playlistRef = doc(firestore, "playlists", playlistId);
      await updateDoc(playlistRef, {
        songIds: arrayUnion(songId),
        updatedAt: new Date(),
      });

      return { success: true, message: "Song added successfully" };
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      throw error;
    }
  },

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      const playlistRef = doc(firestore, "playlists", playlistId);
      await updateDoc(playlistRef, {
        songIds: arrayRemove(songId),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      throw error;
    }
  },

  async updatePlaylist(playlistId, updates) {
    try {
      const playlistRef = doc(firestore, "playlists", playlistId);
      await updateDoc(playlistRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating playlist:", error);
      throw error;
    }
  },

  async deletePlaylist(playlistId) {
    try {
      await deleteDoc(doc(firestore, "playlists", playlistId));
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw error;
    }
  },

  async getPlaylistsWithSongs(userId) {
    try {
      const playlists = await this.getPlaylistsByUserId(userId);

      const playlistsWithSongs = await Promise.all(
        playlists.map(async (playlist) => {
          if (!playlist.songIds || playlist.songIds.length === 0) {
            return {
              ...playlist,
              tracks: [],
              finalImageUrl: "/mini-logo.svg",
              isGridImage: false,
              gridImages: null,
            };
          }

          const { trackService } = await import("./index");
          const songs = await trackService.getTracksByIds(playlist.songIds);
          const { durationService } = await import("./durationService");
          const songsWithDuration =
            await durationService.getMultipleTrackDurations(songs, false);

          const tracks = songsWithDuration.map((song) => ({
            id: song.id,
            title: song.title,
            artists: song.artists,
            audioUrl: song.audioUrl,
            duration: song.duration || "--:--",
            genre: song.genre,
            description: song.description,
            imageUrl: song.imageUrl,
          }));

          let finalImageUrl = "/mini-logo.svg";
          let isGridImage = false;
          let gridImages = null;

          if (tracks.length === 1) {
            finalImageUrl = tracks[0].imageUrl || "/mini-logo.svg";
          } else if (tracks.length >= 4) {
            isGridImage = true;
            gridImages = tracks
              .slice(0, 4)
              .map((t) => t.imageUrl || "/mini-logo.svg");
          } else if (tracks.length > 1) {
            finalImageUrl = tracks[0].imageUrl || "/mini-logo.svg";
          }

          return {
            ...playlist,
            tracks,
            trackCount: tracks.length,
            finalImageUrl,
            isGridImage,
            gridImages,
          };
        })
      );

      return playlistsWithSongs;
    } catch (error) {
      console.error("Error fetching playlists with songs:", error);
      throw error;
    }
  },

  async isSongInPlaylist(playlistId, songId) {
    try {
      const playlist = await this.getPlaylistById(playlistId);
      return playlist.songIds && playlist.songIds.includes(songId);
    } catch (error) {
      console.error("Error checking song in playlist:", error);
      return false;
    }
  },
};

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { VALIDATION_PATTERNS } from "../../constants/validation";

export const userService = {
  async getUserById(userId) {
    try {
      const docRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },
  async getUserByUsername(username) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", username.toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  },
  async getUserByDisplayName(displayName) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("displayName", "==", displayName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user by display name:", error);
      throw error;
    }
  },
  async searchUsers(searchTerm, limitCount = 10) {
    try {
      const searchLower = searchTerm.toLowerCase();
      const allUsers = await this.getAllUsers();

      const matchingUsers = allUsers.filter((user) => {
        const displayNameMatch = user.displayName
          ?.toLowerCase()
          .includes(searchLower);
        const usernameMatch = user.username
          ?.toLowerCase()
          .includes(searchLower);
        return displayNameMatch || usernameMatch;
      });

      const usersWithCounts = await Promise.all(
        matchingUsers.slice(0, limitCount).map(async (user) => {
          try {
            const { trackService } = await import("./trackService");
            const tracks = await trackService.getTracksByUserId(user.id);
            const songsCount = tracks.filter(
              (track) =>
                track.artists &&
                track.artists.length > 0 &&
                track.title &&
                track.audioUrl
            ).length;

            const { albumService } = await import("./albumService");
            const albums = await albumService.getAlbumsByUserId(user.id);
            const albumsCount = albums.filter(
              (album) => album.trackCount > 0
            ).length;

            return {
              ...user,
              songs: songsCount,
              albums: albumsCount,
            };
          } catch (error) {
            console.error(`Error fetching counts for user ${user.id}:`, error);
            return {
              ...user,
              songs: 0,
              albums: 0,
            };
          }
        })
      );

      return usersWithCounts;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
  async getAllUsers() {
    try {
      const q = query(collection(firestore, "users"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  },
  async updateUserProfile(userId, updates) {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date(),
      };

      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, updatedData);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
  async checkUsernameAvailability(username) {
    try {
      if (!VALIDATION_PATTERNS.USERNAME.test(username)) {
        throw new Error("Invalid username format");
      }

      const q = query(
        collection(firestore, "users"),
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw error;
    }
  },
  async createUserProfile(userId, profileData) {
    try {
      const dataToSave = {
        ...profileData,
        followers: profileData.followers || 0,
        following: profileData.following || 0,
        songs: profileData.songs || 0,
        albums: profileData.albums || 0,
        createdAt: profileData.createdAt || new Date(),
      };

      await setDoc(doc(firestore, "users", userId), dataToSave);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },
  async validateUserData(userData) {
    const errors = {};

    if (!VALIDATION_PATTERNS.USERNAME.test(userData.username)) {
      errors.username = "Invalid username format";
    }

    if (userData.email && !VALIDATION_PATTERNS.EMAIL.test(userData.email)) {
      errors.email = "Invalid email format";
    }

    if (!userData.displayName || userData.displayName.trim().length === 0) {
      errors.displayName = "Display name is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

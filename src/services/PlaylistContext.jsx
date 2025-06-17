import { createContext, useContext, useState, useCallback } from "react";
import { playlistService } from "./api/playlistService";
import { useAuth } from "./auth/AuthContext";

const PlaylistContext = createContext();

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const createPlaylist = async (name, description = "") => {
    if (!currentUser) throw new Error("User not authenticated");

    try {
      setLoading(true);
      const playlistId = await playlistService.createPlaylist(currentUser.uid, {
        name,
        description,
        createdBy: currentUser.displayName || "Anonymous",
        imageUrl: "/mini-logo.svg",
      });

      await fetchUserPlaylists();
      return playlistId;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const result = await playlistService.addSongToPlaylist(
        playlistId,
        songId
      );
      await fetchUserPlaylists();
      return result;
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      throw error;
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await playlistService.deletePlaylist(playlistId);
      await fetchUserPlaylists();
      return { success: true };
    } catch (error) {
      console.error("Error deleting playlist:", error);
      throw error;
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      await playlistService.removeSongFromPlaylist(playlistId, songId);
      await fetchUserPlaylists();
      return { success: true };
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      throw error;
    }
  };

  const fetchUserPlaylists = useCallback(async () => {
    if (!currentUser) return;

    try {
      const playlists = await playlistService.getPlaylistsWithSongs(
        currentUser.uid
      );
      setUserPlaylists(playlists);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
  }, [currentUser]);

  const value = {
    userPlaylists,
    loading,
    createPlaylist,
    addSongToPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    fetchUserPlaylists,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

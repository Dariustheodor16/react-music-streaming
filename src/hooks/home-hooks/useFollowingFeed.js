import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import { getFollowing } from "../../services/followService";
import { trackService, durationService } from "../../services/api";

export const useFollowingFeed = () => {
  const { currentUser } = useAuth();
  const [followingMixPlaylist, setFollowingMixPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowingFeed();
  }, [currentUser]);

  const fetchFollowingFeed = async () => {
    if (!currentUser) {
      setFollowingMixPlaylist(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const followingUserIds = await getFollowing(currentUser.uid);

      if (followingUserIds.length === 0) {
        setFollowingMixPlaylist(null);
        setLoading(false);
        return;
      }

      const allSongs = [];

      for (const userId of followingUserIds) {
        try {
          const userSongs = await trackService.getTracksByUserId(userId, 8);
          allSongs.push(...userSongs);
        } catch (error) {
          console.warn(`Could not fetch songs for user ${userId}:`, error);
        }
      }

      if (allSongs.length === 0) {
        setFollowingMixPlaylist(null);
        setLoading(false);
        return;
      }

      const sortedSongs = allSongs.sort((a, b) => {
        const dateA = a.uploadedAt
          ? new Date(a.uploadedAt.seconds * 1000)
          : new Date(0);
        const dateB = b.uploadedAt
          ? new Date(b.uploadedAt.seconds * 1000)
          : new Date(0);
        return dateB - dateA;
      });

      const playlistSongs = sortedSongs.slice(0, 15);
      const songsWithDuration = await durationService.getMultipleTrackDurations(
        playlistSongs,
        false
      );

      if (songsWithDuration.length > 0) {
        const playlist = createFollowingMixPlaylist(songsWithDuration);
        setFollowingMixPlaylist(playlist);
      }
    } catch (error) {
      console.error("Error fetching following feed:", error);
      setFollowingMixPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  const createFollowingMixPlaylist = (songs) => {
    if (songs.length === 0) return null;

    const userDisplayName =
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "You";

    let displayImage = "/mini-logo.svg";
    let showGrid = false;
    let gridImages = [];

    if (songs.length >= 4) {
      showGrid = true;
      gridImages = songs
        .slice(0, 4)
        .map((song) => song.imageUrl || "/mini-logo.svg");
    } else if (songs.length > 0) {
      displayImage = songs[0]?.imageUrl || "/mini-logo.svg";
    }

    return {
      id: `following-mix-${currentUser.uid}`,
      name: "Following Mix",
      type: "playlist",
      artist: `Made for ${userDisplayName}`,
      tracks: songs.map((song) => ({
        id: song.id,
        title: song.title,
        artists: song.artists || [song.artist || "Unknown Artist"],
        artist: song.artists
          ? song.artists.join(", ")
          : song.artist || "Unknown Artist",
        audioUrl: song.audioUrl,
        duration: song.duration,
        genre: song.genre,
        imageUrl: song.imageUrl,
      })),
      image: displayImage,
      showGrid: showGrid,
      gridImages: gridImages,
    };
  };

  return {
    followingMixPlaylist,
    loading,
    refetch: fetchFollowingFeed,
  };
};

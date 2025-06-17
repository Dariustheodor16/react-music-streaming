import { useState, useEffect } from "react";
import { playlistService } from "../../services/api/playlistService";

export const usePlaylists = (userId) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const playlistsData = await playlistService.getPlaylistsWithSongs(
          userId
        );

        const formattedPlaylists = playlistsData.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          image: playlist.imageUrl || "/mini-logo.svg",
          type: "playlist",
          artist: playlist.createdBy || "You",
          tracks: playlist.tracks || [],
          trackCount: playlist.trackCount || 0,
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt,
        }));

        setPlaylists(formattedPlaylists);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  return { playlists, loading, error, refetch: () => fetchPlaylists() };
};

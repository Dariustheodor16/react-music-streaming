import { useState, useEffect, useCallback } from "react";
import { albumService, trackService } from "../../services/api";
import { durationService } from "../../services/api/durationService";

export const useAlbums = (userId, refreshKey = 0) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const albumsData = await albumService.getAlbumsByUserId(userId);
      const albumsWithTracks = [];

      for (const albumData of albumsData) {
        const tracks = await trackService.getTracksByAlbumId(albumData.id);

        if (tracks && tracks.length > 0) {
          const tracksWithDuration =
            await durationService.getMultipleTrackDurations(tracks);

          albumsWithTracks.push({
            id: albumData.id,
            name: albumData.name,
            artist: albumData.artist,
            type: albumData.type,
            image: albumData.imageUrl,
            releaseDate: albumData.releaseDate,
            createdAt: albumData.createdAt,
            tracks: tracksWithDuration,
            totalTracks: tracksWithDuration.length,
            totalDuration: tracksWithDuration.reduce((total, track) => {
              if (track.duration && track.duration !== "--:--") {
                const [minutes, seconds] = track.duration
                  .split(":")
                  .map(Number);
                return total + minutes * 60 + seconds;
              }
              return total;
            }, 0),
          });
        } else {
          albumsWithTracks.push({
            id: albumData.id,
            name: albumData.name,
            artist: albumData.artist,
            type: albumData.type,
            image: albumData.imageUrl,
            releaseDate: albumData.releaseDate,
            createdAt: albumData.createdAt,
            tracks: [],
            totalTracks: 0,
            totalDuration: 0,
          });
        }
      }

      albumsWithTracks.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });

      setAlbums(albumsWithTracks);
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError("Failed to load albums");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums, refreshKey]);

  return {
    albums,
    loading,
    error,
    refetch: fetchAlbums,
  };
};

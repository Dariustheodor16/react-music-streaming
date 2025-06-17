import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext";
import { useSongs } from "../hooks/song-control-hooks";
import { useAlbums } from "../hooks/profile-hooks/useAlbums";
import { commentService } from "../services/api/commentService";
import { useLikes } from "../services/LikeContext";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import DashboardHeader from "../components/blocks/DashboardBlocks/DashboardHeader";
import DashboardContent from "../components/blocks/DashboardBlocks/DashboardContent";
import DeleteConfirmModal from "../components/ui/Modals/DeleteConfirmModal";
import styled from "styled-components";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [songStats, setSongStats] = useState({});
  const [albumStats, setAlbumStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [dashboardSongs, setDashboardSongs] = useState([]);
  const [dashboardAlbums, setDashboardAlbums] = useState([]);

  const {
    songs: fetchedSongs,
    loading: songsLoading,
    refetch: refetchSongs,
  } = useSongs(currentUser?.uid, refreshKey);

  const {
    albums: fetchedAlbums,
    loading: albumsLoading,
    refetch: refetchAlbums,
  } = useAlbums(currentUser?.uid, refreshKey);

  const { getLikeCount } = useLikes();
  useEffect(() => {
    setDashboardSongs(fetchedSongs);
  }, [fetchedSongs]);

  useEffect(() => {
    setDashboardAlbums(fetchedAlbums);
  }, [fetchedAlbums]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!fetchedSongs.length && !fetchedAlbums.length) return;

      try {
        setLoading(true);

        const allTrackIds = new Set();
        fetchedSongs.forEach((song) => {
          allTrackIds.add(song.id);
        });

        fetchedAlbums.forEach((album) => {
          if (album.tracks && album.tracks.length > 0) {
            album.tracks.forEach((track) => {
              allTrackIds.add(track.id);
            });
          }
        });
        const { playCountService } = await import(
          "../services/api/playCountService"
        );
        const allPlayCounts = await playCountService.getMultiplePlayCounts([
          ...allTrackIds,
        ]);
        const songStatsData = {};
        const songStatsPromises = fetchedSongs.map(async (song) => {
          const [likes, comments] = await Promise.all([
            getLikeCount(song.id, "song"),
            commentService.getCommentsBySongId(song.id).then((c) => c.length),
          ]);

          songStatsData[song.id] = {
            likes,
            comments,
            plays: allPlayCounts.get(song.id) || 0,
          };
        });

        const albumStatsData = {};
        const albumStatsPromises = fetchedAlbums.map(async (album) => {
          const [likes, comments] = await Promise.all([
            getLikeCount(album.id, "album"),
            commentService.getCommentsByAlbumId(album.id).then((c) => c.length),
          ]);
          let totalPlays = 0;
          if (album.tracks && album.tracks.length > 0) {
            totalPlays = album.tracks.reduce((sum, track) => {
              return sum + (allPlayCounts.get(track.id) || 0);
            }, 0);
          }

          albumStatsData[album.id] = {
            likes,
            comments,
            totalTracks: album.tracks?.length || 0,
            plays: totalPlays,
          };
        });

        await Promise.all([...songStatsPromises, ...albumStatsPromises]);

        setSongStats(songStatsData);
        setAlbumStats(albumStatsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!songsLoading && !albumsLoading) {
      fetchStats();
    }
  }, [fetchedSongs, fetchedAlbums, songsLoading, albumsLoading, getLikeCount]);

  const handleDeleteSong = async (songId) => {
    try {
      const { trackService } = await import("../services/api");
      await trackService.deleteTrack(songId);
      setDashboardSongs((prev) => prev.filter((song) => song.id !== songId));
      setRefreshKey((prev) => prev + 1);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song. Please try again.");
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      const { albumService } = await import("../services/api");
      await albumService.deleteAlbum(albumId);

      setDashboardAlbums((prev) =>
        prev.filter((album) => album.id !== albumId)
      );
      setDashboardSongs((prev) =>
        prev.filter((song) => song.albumId !== albumId)
      );

      setRefreshKey((prev) => prev + 1);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Failed to delete album. Please try again.");
    }
  };

  const handleSongUpdate = (updatedSong) => {
    const imageWithTimestamp = updatedSong.image?.includes("?")
      ? `${updatedSong.image}&t=${Date.now()}`
      : `${updatedSong.image}?t=${Date.now()}`;

    const songWithUpdatedImage = {
      ...updatedSong,
      image: imageWithTimestamp,
      imageUrl: imageWithTimestamp,
    };
    setDashboardSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === updatedSong.id ? { ...song, ...songWithUpdatedImage } : song
      )
    );
    if (updatedSong.albumId) {
      setDashboardAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === updatedSong.albumId
            ? {
                ...album,
                image: imageWithTimestamp,
                imageUrl: imageWithTimestamp,
              }
            : album
        )
      );
      setDashboardSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.albumId === updatedSong.albumId
            ? {
                ...song,
                image: imageWithTimestamp,
                imageUrl: imageWithTimestamp,
              }
            : song
        )
      );
    }

    setRefreshKey((prev) => prev + 1);
  };

  const handleAlbumUpdate = (updatedAlbum) => {
    const imageWithTimestamp = updatedAlbum.image?.includes("?")
      ? `${updatedAlbum.image}&t=${Date.now()}`
      : `${updatedAlbum.image}?t=${Date.now()}`;

    const albumWithUpdatedImage = {
      ...updatedAlbum,
      image: imageWithTimestamp,
      imageUrl: imageWithTimestamp,
    };
    setDashboardAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.id === updatedAlbum.id
          ? { ...album, ...albumWithUpdatedImage }
          : album
      )
    );
    setDashboardSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.albumId === updatedAlbum.id
          ? { ...song, image: imageWithTimestamp, imageUrl: imageWithTimestamp }
          : song
      )
    );

    setRefreshKey((prev) => prev + 1);
  };

  const getTotalStats = () => {
    const totalPlays = dashboardSongs.reduce(
      (sum, song) => sum + (songStats[song.id]?.plays || 0),
      0
    );
    const totalLikes = [
      ...dashboardSongs.map((song) => songStats[song.id]?.likes || 0),
      ...dashboardAlbums.map((album) => albumStats[album.id]?.likes || 0),
    ].reduce((sum, likes) => sum + likes, 0);
    const totalComments = [
      ...dashboardSongs.map((song) => songStats[song.id]?.comments || 0),
      ...dashboardAlbums.map((album) => albumStats[album.id]?.comments || 0),
    ].reduce((sum, comments) => sum + comments, 0);

    return { totalPlays, totalLikes, totalComments };
  };

  const { totalPlays, totalLikes, totalComments } = getTotalStats();

  if (!currentUser) return null;

  return (
    <MainWrapper>
      <Navbar />
      <ContentWrapper>
        <DashboardHeader
          totalPlays={totalPlays}
          totalLikes={totalLikes}
          totalComments={totalComments}
          totalReleases={dashboardSongs.length + dashboardAlbums.length}
        />

        <DashboardContent
          songs={dashboardSongs}
          albums={dashboardAlbums}
          songStats={songStats}
          albumStats={albumStats}
          onDeleteRequest={setShowDeleteConfirm}
          navigate={navigate}
          onSongUpdate={handleSongUpdate}
          onAlbumUpdate={handleAlbumUpdate}
        />

        {showDeleteConfirm && (
          <DeleteConfirmModal
            type={showDeleteConfirm.type}
            name={showDeleteConfirm.name}
            onConfirm={() => {
              if (showDeleteConfirm.type === "song") {
                handleDeleteSong(showDeleteConfirm.id);
              } else {
                handleDeleteAlbum(showDeleteConfirm.id);
              }
            }}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </ContentWrapper>
      <ControlBar />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #232323;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 32px 16px 120px;
  overflow-y: auto;
`;

export default Dashboard;

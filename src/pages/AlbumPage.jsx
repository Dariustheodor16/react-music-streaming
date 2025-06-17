import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albumService, trackService } from "../services/api";
import { durationService } from "../services/api/durationService";
import { useLikes } from "../services/LikeContext";
import { useAudio } from "../services/AudioContext";
import { useColorExtraction } from "../hooks/profile-hooks/useColorExtraction";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import AlbumBanner from "../components/blocks/AlbumBlocks/AlbumBanner";
import AlbumContent from "../components/blocks/AlbumBlocks/AlbumContent";
import styled from "styled-components";
import { formatNumber } from "../utils/formatNumbers";

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        const albumData = await albumService.getAlbumById(albumId);
        setAlbum(albumData);
        const tracksData = await trackService.getTracksByAlbumId(albumId);
        const tracksWithDuration =
          await durationService.getMultipleTrackDurations(tracksData);

        setTracks(tracksWithDuration);
      } catch (err) {
        console.error("Error fetching album:", err);
        setError("Album not found");
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  if (loading) {
    return (
      <MainWrapper>
        <Navbar />
        <LoadingState>Loading album...</LoadingState>
        <ControlBar />
      </MainWrapper>
    );
  }

  if (error || !album) {
    return (
      <MainWrapper>
        <Navbar />
        <ErrorState>{error || "Album not found"}</ErrorState>
        <ControlBar />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Navbar />
      <ContentWrapper>
        <AlbumBanner album={album} tracks={tracks} />
        <AlbumContent album={album} tracks={tracks} />
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
  overflow-y: auto;
  padding-bottom: 120px;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #fff;
  font-size: 24px;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #ff4343;
  font-size: 24px;
`;

export default AlbumPage;

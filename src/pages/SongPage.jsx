import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trackService } from "../services/api";
import { durationService } from "../services/api/durationService";
import { playCountService } from "../services/api/playCountService";
import { useLikes } from "../services/LikeContext";
import { useAudio } from "../services/AudioContext";
import { useColorExtraction } from "../hooks/profile-hooks/useColorExtraction";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import SongBanner from "../components/blocks/SongBlocks/SongBanner";
import SongContent from "../components/blocks/SongBlocks/SongContent";
import { formatNumber } from "../utils/formatNumbers";
import styled from "styled-components";

const SongPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [playCount, setPlayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);
        const songData = await trackService.getTrackById(songId);
        const songWithDuration =
          await durationService.getMultipleTrackDurations([songData]);
        const finalSong = songWithDuration[0];
        const plays = await playCountService.getPlayCount(songId);

        setSong(finalSong);
        setPlayCount(plays);
      } catch (err) {
        console.error("Error fetching song:", err);
        setError("Song not found");
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchSongData();
    }
  }, [songId]);

  if (loading) {
    return (
      <MainWrapper>
        <Navbar />
        <LoadingState>Loading song...</LoadingState>
        <ControlBar />
      </MainWrapper>
    );
  }

  if (error || !song) {
    return (
      <MainWrapper>
        <Navbar />
        <ErrorState>{error || "Song not found"}</ErrorState>
        <ControlBar />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Navbar />
      <ContentWrapper>
        <SongBanner song={song} playCount={formatNumber(playCount)} />{" "}
        <SongContent song={song} />
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

export default SongPage;

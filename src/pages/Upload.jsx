import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AudioUpload from "../components/blocks/uploadBlocks/AudioUpload";
import TrackInfo from "../components/blocks/uploadBlocks/TrackInfo";
import AlbumCreator from "../components/blocks/uploadBlocks/AlbumCreator";
import { useAudio } from "../services/AudioContext";

const Upload = () => {
  const [uploadMode, setUploadMode] = useState("single");
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [albumData, setAlbumData] = useState(null);
  const [createdAlbumId, setCreatedAlbumId] = useState(null);
  const { currentSong, clearCurrentSong } = useAudio();
  const navigate = useNavigate();

  const handleAudioUploaded = (files) => {
    if (Array.isArray(files)) {
      setAudioFiles(files);
      setUploadMode("album");
    } else {
      setAudioFiles([files]);
      setUploadMode("single");
    }
    setCurrentTrackIndex(0);
  };

  const handleAlbumDataSet = (data) => {
    setAlbumData(data);
  };

  const handleRemoveTrack = (indexToRemove) => {
    const newAudioFiles = audioFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setAudioFiles(newAudioFiles);

    if (currentTrackIndex >= indexToRemove && currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    }

    if (newAudioFiles.length === 0) {
      setUploadMode("single");
      setAlbumData(null);
      setCreatedAlbumId(null);
      setCurrentTrackIndex(0);
    } else if (newAudioFiles.length === 1) {
      setUploadMode("single");
      setAlbumData(null);
      setCreatedAlbumId(null);
      setCurrentTrackIndex(0);
    }
  };
  const handleAddMoreTracks = (newFiles) => {
    const combinedFiles = [...audioFiles, ...newFiles];
    setAudioFiles(combinedFiles);
  };

  const handleTrackComplete = (albumId = null) => {
    if (albumId && !createdAlbumId) {
      setCreatedAlbumId(albumId);
    }

    if (currentTrackIndex < audioFiles.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    } else {
      navigate("/profile");
    }
  };

  const handleBack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    } else {
      setAudioFiles([]);
      setAlbumData(null);
      setCreatedAlbumId(null);
      setUploadMode("single");
    }
  };

  useEffect(() => {
    if (currentSong) {
      clearCurrentSong();
    }
  }, [currentSong, clearCurrentSong]);

  if (audioFiles.length === 0) {
    return <AudioUpload onUploaded={handleAudioUploaded} />;
  }

  if (uploadMode === "album" && !albumData) {
    return (
      <AlbumCreator
        trackCount={audioFiles.length}
        trackNames={audioFiles.map((file) =>
          file.name.replace(/\.[^/.]+$/, "")
        )}
        onAlbumDataSet={handleAlbumDataSet}
        onBack={() => setAudioFiles([])}
        onRemoveTrack={handleRemoveTrack}
        onAddMoreTracks={handleAddMoreTracks}
      />
    );
  }

  return (
    <TrackInfo
      audioFile={audioFiles[currentTrackIndex]}
      trackNumber={currentTrackIndex + 1}
      totalTracks={audioFiles.length}
      albumData={albumData}
      existingAlbumId={createdAlbumId}
      isMultiUpload={uploadMode === "album"}
      onTrackComplete={handleTrackComplete}
      onBack={handleBack}
      isLastTrack={currentTrackIndex === audioFiles.length - 1}
    />
  );
};

export default Upload;

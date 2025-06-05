import { useState, useEffect } from "react";
import AudioUpload from "../components/blocks/uploadBlocks/AudioUpload";
import TrackInfo from "../components/blocks/uploadBlocks/TrackInfo";
import { useAudio } from "../services/audioContext.jsx";

const Upload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [showTrackInfo, setShowTrackInfo] = useState(false);
  const { currentSong, clearCurrentSong } = useAudio();

  const handleAudioUploaded = (file) => {
    setAudioFile(file);
    setShowTrackInfo(true);
  };

  useEffect(() => {
    if (currentSong) {
      clearCurrentSong();
    }
  }, []);

  return (
    <>
      {!showTrackInfo ? (
        <AudioUpload onUploaded={handleAudioUploaded} />
      ) : (
        <TrackInfo audioFile={audioFile} />
      )}
    </>
  );
};

export default Upload;

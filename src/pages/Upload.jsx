import { useState } from "react";
import AudioUpload from "../components/blocks/uploadBlocks/AudioUpload";
import TrackInfo from "../components/blocks/uploadBlocks/TrackInfo";

const Upload = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [showTrackInfo, setShowTrackInfo] = useState(false);

  const handleAudioUploaded = (file) => {
    setAudioFile(file);
    setShowTrackInfo(true);
  };

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

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Info from "./pages/Info";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import ControlBar from "./components/players/ControlBar";
import { AudioProvider } from "./services/audioContext.jsx";

function App() {
  return (
    <AudioProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/info" element={<Info />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ControlBar />
    </AudioProvider>
  );
}

export default App;

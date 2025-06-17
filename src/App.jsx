import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Library from "./pages/Library";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import AlbumPage from "./pages/AlbumPage";
import SongPage from "./pages/SongPage";
import ControlBar from "./components/players/ControlBar";
import { AudioProvider } from "./services/AudioContext";
import { LikeProvider } from "./services/LikeContext";
import { PlaylistProvider } from "./services/PlaylistContext";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import PlaylistPage from "./pages/PlaylistPage";
import ScrollToTop from "./components/ui/ScrollToTop";

function App() {
  return (
    <AudioProvider>
      <LikeProvider>
        <PlaylistProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/album/:albumId" element={<AlbumPage />} />
            <Route path="/song/:songId" element={<SongPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          </Routes>
          <ControlBar />
        </PlaylistProvider>
      </LikeProvider>
    </AudioProvider>
  );
}

export default App;

export const useMusicDisplayLogic = (songs, playlists, activeTab) => {
  const useSideLayout =
    playlists.length > 0 && playlists.length <= 1 && songs.length > 0;

  const showEmptyState = () => {
    if (activeTab === "songs") {
      return songs.length === 0;
    } else if (activeTab === "albums") {
      return playlists.length === 0;
    } else {
      return songs.length === 0 && playlists.length === 0;
    }
  };

  return {
    useSideLayout,
    showEmptyState: showEmptyState(),
  };
};

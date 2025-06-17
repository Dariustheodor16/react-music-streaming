export const useMusicDisplayLogic = (songs, albums, activeTab) => {
  const useSideLayout =
    albums.length > 0 && albums.length <= 1 && songs.length > 0;

  const showEmptyState = () => {
    if (activeTab === "songs") {
      return songs.length === 0;
    } else if (activeTab === "albums") {
      return albums.length === 0;
    } else {
      return songs.length === 0 && albums.length === 0;
    }
  };

  return {
    useSideLayout,
    showEmptyState: showEmptyState(),
  };
};

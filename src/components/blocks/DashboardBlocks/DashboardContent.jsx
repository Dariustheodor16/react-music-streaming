import { useState } from "react";
import styled from "styled-components";
import OverviewTab from "./tabs/OverviewTab";
import SongsTab from "./tabs/SongsTab";
import AlbumsTab from "./tabs/AlbumsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import EditSongModal from "../../ui/Modals/EditSongModal";
import EditAlbumModal from "../../ui/Modals/EditAlbumModal";
import FilterIcon from "../../../assets/icons/filter.svg?react";
import { formatNumber } from "../../../utils/formatNumbers";

const DashboardContent = ({
  songs,
  albums,
  songStats,
  albumStats,
  onDeleteRequest,
  onSongUpdate,
  onAlbumUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showEditSongModal, setShowEditSongModal] = useState(false);
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleEditSong = (song) => {
    setSelectedSong(song);
    setShowEditSongModal(true);
  };

  const handleEditAlbum = (album) => {
    setSelectedAlbum(album);
    setShowEditAlbumModal(true);
  };

  const handleSongUpdate = (updatedSong) => {
    onSongUpdate?.(updatedSong);
    setShowEditSongModal(false);
    setSelectedSong(null);
  };

  const handleAlbumUpdate = (updatedAlbum) => {
    onAlbumUpdate?.(updatedAlbum);
    setShowEditAlbumModal(false);
    setSelectedAlbum(null);
  };

  const filterOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-liked", label: "Most Liked" },
    { value: "most-played", label: "Most Played" },
    { value: "most-commented", label: "Most Commented" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const sortItems = (items, type) => {
    const itemsWithStats = items.map((item) => ({
      ...item,
      likes:
        type === "songs"
          ? songStats[item.id]?.likes || 0
          : albumStats[item.id]?.likes || 0,
      plays:
        type === "songs"
          ? songStats[item.id]?.plays || 0
          : albumStats[item.id]?.plays || 0,
      comments:
        type === "songs"
          ? songStats[item.id]?.comments || 0
          : albumStats[item.id]?.comments || 0,
    }));

    return itemsWithStats.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const aDate = a.createdAt || a.releaseDate;
          const bDate = b.createdAt || b.releaseDate;
          if (!aDate || !bDate) return 0;
          const aTime = aDate.toMillis
            ? aDate.toMillis()
            : new Date(aDate).getTime();
          const bTime = bDate.toMillis
            ? bDate.toMillis()
            : new Date(bDate).getTime();
          return bTime - aTime;

        case "oldest":
          const aDateOld = a.createdAt || a.releaseDate;
          const bDateOld = b.createdAt || b.releaseDate;
          if (!aDateOld || !bDateOld) return 0;
          const aTimeOld = aDateOld.toMillis
            ? aDateOld.toMillis()
            : new Date(aDateOld).getTime();
          const bTimeOld = bDateOld.toMillis
            ? bDateOld.toMillis()
            : new Date(bDateOld).getTime();
          return aTimeOld - bTimeOld;

        case "most-liked":
          return b.likes - a.likes;

        case "most-played":
          return b.plays - a.plays;

        case "most-commented":
          return b.comments - a.comments;

        case "alphabetical":
          return (a.name || a.title || "").localeCompare(
            b.name || b.title || ""
          );

        default:
          return 0;
      }
    });
  };

  const renderTabContent = () => {
    const sortedSongs = sortItems(songs, "songs");
    const sortedAlbums = sortItems(albums, "albums");

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            songs={sortedSongs}
            albums={sortedAlbums}
            songStats={songStats}
            albumStats={albumStats}
            setActiveTab={setActiveTab}
            sortBy={sortBy}
          />
        );
      case "songs":
        return (
          <SongsTab
            songs={sortedSongs}
            songStats={songStats}
            onEditSong={handleEditSong}
            onDeleteRequest={onDeleteRequest}
          />
        );
      case "albums":
        return (
          <AlbumsTab
            albums={sortedAlbums}
            albumStats={albumStats}
            onEditAlbum={handleEditAlbum}
            onDeleteRequest={onDeleteRequest}
          />
        );
      case "notifications":
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <TabsContainer>
        <TabsLeft>
          <Tab
            $active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Tab>
          <Tab
            $active={activeTab === "songs"}
            onClick={() => setActiveTab("songs")}
          >
            Songs ({songs.length})
          </Tab>
          <Tab
            $active={activeTab === "albums"}
            onClick={() => setActiveTab("albums")}
          >
            Albums ({albums.length})
          </Tab>
          <Tab
            $active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </Tab>
        </TabsLeft>
        {(activeTab === "songs" ||
          activeTab === "albums" ||
          activeTab === "overview") && (
          <TabsRight>
            <FilterContainer>
              <FilterButton
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                $active={showFilterDropdown}
              >
                <FilterIcon />
                Sort by:{" "}
                {filterOptions.find((opt) => opt.value === sortBy)?.label}
              </FilterButton>

              {showFilterDropdown && (
                <FilterDropdown>
                  {filterOptions.map((option) => (
                    <FilterOption
                      key={option.value}
                      $active={sortBy === option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {option.label}
                    </FilterOption>
                  ))}
                </FilterDropdown>
              )}
            </FilterContainer>
          </TabsRight>
        )}
      </TabsContainer>

      <ContentSection>{renderTabContent()}</ContentSection>

      <EditSongModal
        isOpen={showEditSongModal}
        onClose={() => {
          setShowEditSongModal(false);
          setSelectedSong(null);
        }}
        song={selectedSong}
        onUpdate={handleSongUpdate}
      />

      <EditAlbumModal
        isOpen={showEditAlbumModal}
        onClose={() => {
          setShowEditAlbumModal(false);
          setSelectedAlbum(null);
        }}
        album={selectedAlbum}
        onUpdate={handleAlbumUpdate}
      />
    </>
  );
};
const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
`;

const TabsLeft = styled.div`
  display: flex;
`;

const TabsRight = styled.div`
  display: flex;
  align-items: center;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#ff4343" : "#d9d9d9")};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#ff4343" : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const FilterContainer = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $active }) =>
    $active ? "rgba(255, 67, 67, 0.1)" : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 67, 67, 0.3)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#ff4343" : "#d9d9d9")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(255, 67, 67, 0.15)" : "rgba(255, 255, 255, 0.1)"};
    color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const FilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #191919;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  overflow: hidden;
`;

const FilterOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: ${({ $active }) =>
    $active ? "rgba(255, 67, 67, 0.1)" : "transparent"};
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#ff4343" : "#d9d9d9")};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
`;

const ContentSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export default DashboardContent;

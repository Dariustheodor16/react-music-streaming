import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import NotificationsSection from "../sections/NotificationsSection";
import RecentContentSection from "../sections/RecentContentSection";

const OverviewTab = ({
  songs,
  albums,
  songStats,
  albumStats,
  setActiveTab,
  sortBy,
}) => {
  const navigate = useNavigate();

  const recentItems = [...songs, ...albums].slice(0, 8).map((item) => ({
    ...item,
    likes:
      item.type === "album" || item.type === "EP"
        ? albumStats[item.id]?.likes || 0
        : songStats[item.id]?.likes || 0,
    plays:
      item.type === "album" || item.type === "EP"
        ? albumStats[item.id]?.plays || 0
        : songStats[item.id]?.plays || 0,
  }));

  return (
    <OverviewContainer>
      <NotificationsSection setActiveTab={setActiveTab} />
      <RecentContentSection
        recentItems={recentItems}
        songStats={songStats}
        albumStats={albumStats}
        navigate={navigate}
        sortBy={sortBy}
      />
    </OverviewContainer>
  );
};

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default OverviewTab;

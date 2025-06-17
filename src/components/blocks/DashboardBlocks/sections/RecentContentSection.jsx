import styled from "styled-components";
import PlayIcon from "../../../../assets/icons/play.svg?react";
import HeartIcon from "../../../../assets/icons/heart.svg?react";
import EmptyState from "../common/EmptyState";

const RecentContentSection = ({
  recentItems,
  songStats,
  albumStats,
  navigate,
  sortBy,
}) => {
  const getFilterLabel = () => {
    const filterMap = {
      newest: "Recent Content (Newest First)",
      oldest: "Recent Content (Oldest First)",
      "most-liked": "Most Liked Content",
      "most-played": "Most Played Content",
      "most-commented": "Most Commented Content",
      alphabetical: "Content (A-Z)",
    };
    return filterMap[sortBy] || "Recent Content";
  };

  if (recentItems.length === 0) {
    return (
      <ContentSectionContainer>
        <SectionTitle>{getFilterLabel()}</SectionTitle>
        <EmptyState
          title="No content uploaded yet"
          subtitle="Start by uploading your first song or album"
        />
      </ContentSectionContainer>
    );
  }

  return (
    <ContentSectionContainer>
      <SectionTitle>{getFilterLabel()}</SectionTitle>
      <ItemsList>
        {recentItems.map((item) => (
          <ItemCard key={item.id}>
            <ItemImage src={item.image || "/mini-logo.svg"} alt={item.name} />
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemType>{item.type || "Song"}</ItemType>
            </ItemInfo>
            <ItemStats>
              <StatBadge>
                <PlayIcon />
                {item.type === "album" || item.type === "EP"
                  ? albumStats[item.id]?.plays || 0
                  : songStats[item.id]?.plays || 0}
              </StatBadge>
              <StatBadge>
                <HeartIcon />
                {item.type === "album" || item.type === "EP"
                  ? albumStats[item.id]?.likes || 0
                  : songStats[item.id]?.likes || 0}
              </StatBadge>
            </ItemStats>
            <ItemActions>
              <GoToButton
                onClick={() =>
                  navigate(
                    item.type === "album" || item.type === "EP"
                      ? `/album/${item.id}`
                      : `/song/${item.id}`
                  )
                }
              >
                Go to {item.type || "Song"}
              </GoToButton>
            </ItemActions>
          </ItemCard>
        ))}
      </ItemsList>
    </ContentSectionContainer>
  );
};

const ContentSectionContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 16px;
  gap: 24px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ItemImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemType = styled.div`
  font-size: 14px;
  color: #d9d9d9;
`;

const ItemStats = styled.div`
  display: flex;
  gap: 16px;
  margin-right: 32px;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #d9d9d9;

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const GoToButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default RecentContentSection;

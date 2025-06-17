import styled from "styled-components";
import PlayIcon from "../../../assets/icons/play.svg?react";
import HeartIcon from "../../../assets/icons/heart.svg?react";
import CommentIcon from "../../../assets/icons/comment.svg?react";
import MusicIcon from "../../../assets/icons/music.svg?react";
import { formatNumber } from "../../../utils/formatNumbers";

const DashboardHeader = ({
  totalPlays,
  totalLikes,
  totalComments,
  totalReleases,
}) => {
  return (
    <>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Manage your music and track performance</Subtitle>
      </Header>

      <StatsOverview>
        <StatCard>
          <StatIcon>
            <PlayIcon />
          </StatIcon>
          <StatValue>{formatNumber(totalPlays)}</StatValue>
          <StatLabel>Total Plays</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <HeartIcon />
          </StatIcon>
          <StatValue>{formatNumber(totalLikes)}</StatValue>
          <StatLabel>Total Likes</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <CommentIcon />
          </StatIcon>
          <StatValue>{formatNumber(totalComments)}</StatValue>
          <StatLabel>Total Comments</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <MusicIcon />
          </StatIcon>
          <StatValue>{formatNumber(totalReleases)}</StatValue>
          <StatLabel>Total Releases</StatLabel>
        </StatCard>
      </StatsOverview>
    </>
  );
};

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #d9d9d9;
  margin: 0;
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;

  svg {
    width: 32px;
    height: 32px;
    fill: #ff4343;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #d9d9d9;
`;

export default DashboardHeader;

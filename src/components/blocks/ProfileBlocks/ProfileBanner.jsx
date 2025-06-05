import { useAuth } from "../../../services/authContext";
import { useColorExtraction } from "../../../hooks/profile-hooks/useColorExtraction";
import { useSongsCount } from "../../../hooks/profile-hooks/useSongsCount";
import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";

const ProfileBanner = ({
  profilePic = "/mini-logo.svg",
  username = "Username",
  followers = 0,
  following = 0,
  songs = 0,
  albums = 0,
  onEdit,
}) => {
  const { currentUser } = useAuth();
  const { gradient, imgRef } = useColorExtraction(profilePic);
  const { songsCount } = useSongsCount(currentUser?.uid, songs);

  return (
    <Banner style={{ background: gradient }}>
      <ProfilePic
        src={profilePic}
        alt="Profile"
        crossOrigin="anonymous"
        ref={imgRef}
      />
      <InfoSection>
        <Username>{username}</Username>
        <StatsRow>
          <Stat>
            <StatLabel>Followers</StatLabel>
            <StatValue>{followers}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Following</StatLabel>
            <StatValue>{following}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Songs</StatLabel>
            <StatValue>{songsCount}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Albums</StatLabel>
            <StatValue>{albums}</StatValue>
          </Stat>
        </StatsRow>
      </InfoSection>
      <EditButtonWrapper>
        <PrimaryButton onClick={onEdit}>Edit</PrimaryButton>
      </EditButtonWrapper>
    </Banner>
  );
};

const Banner = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  min-height: 341px;
  height: 341px;
  display: flex;
  align-items: flex-start;
  border-radius: 24px;
  position: relative;
  margin-top: 32px;
  box-sizing: border-box;
  background: ${({ style }) => style?.background || "none"};
  background-blend-mode: lighten, overlay, normal;
  background-size: 200% 200%, 150% 150%, 200% 200%;
  animation: liquidGradientMove 12s ease-in-out infinite;
  transition: background 0.5s;

  @keyframes liquidGradientMove {
    0% {
      background-position: 0% 50%, 50% 50%, 100% 50%;
      background-size: 200% 200%, 150% 150%, 200% 200%;
    }
    50% {
      background-position: 100% 50%, 60% 60%, 0% 50%;
      background-size: 250% 250%, 120% 120%, 180% 180%;
    }
    100% {
      background-position: 0% 50%, 50% 50%, 100% 50%;
      background-size: 200% 200%, 150% 150%, 200% 200%;
    }
  }
`;

const ProfilePic = styled.img`
  width: 253px;
  height: 253px;
  border-radius: 24px;
  object-fit: cover;
  margin-left: 62px;
  margin-top: 24px;
  background: #191919;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 48px;
  margin-top: 32px;
  flex: 1;
`;

const Username = styled.div`
  font-size: 64px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 18px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 64px;
  margin-top: 8px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatLabel = styled.div`
  font-size: 20px;
  color: #d9d9d9;
  font-weight: 400;
`;

const StatValue = styled.div`
  font-size: 32px;
  color: #fff;
  font-weight: 600;
  margin-top: 2px;
`;

const EditButtonWrapper = styled.div`
  position: absolute;
  bottom: 32px;
  right: 48px;
`;

export default ProfileBanner;

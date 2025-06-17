import styled from "styled-components";

const ProfileBannerSkeleton = () => {
  return (
    <SkeletonBanner>
      <ProfilePicSkeleton>
        <SkeletonShimmer />
      </ProfilePicSkeleton>
      <SkeletonInfoSection>
        <DisplayNameSkeleton>
          <SkeletonShimmer />
        </DisplayNameSkeleton>
        <UsernameSkeleton>
          <SkeletonShimmer />
        </UsernameSkeleton>
        <SkeletonStatsRow>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonStat key={i}>
              <SkeletonStatValue>
                <SkeletonShimmer />
              </SkeletonStatValue>
              <SkeletonStatLabel>
                <SkeletonShimmer />
              </SkeletonStatLabel>
            </SkeletonStat>
          ))}
        </SkeletonStatsRow>
      </SkeletonInfoSection>
      <SkeletonButton>
        <SkeletonShimmer />
      </SkeletonButton>
    </SkeletonBanner>
  );
};

const SkeletonShimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const SkeletonBanner = styled.div`
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
  background: linear-gradient(
    120deg,
    rgb(27, 35, 27) 0%,
    rgb(195, 226, 201) 100%
  );
`;

const ProfilePicSkeleton = styled.div`
  width: 232px;
  height: 232px;
  border-radius: 50%;
  background: #2a2a2a;
  margin-top: 54px;
  margin-left: 54px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.1);
`;

const SkeletonInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 54px;
  margin-left: 64px;
  flex: 1;
`;

const DisplayNameSkeleton = styled.div`
  width: 400px;
  height: 96px;
  background: #2a2a2a;
  border-radius: 8px;
  margin: 0;
  position: relative;
  overflow: hidden;
`;

const UsernameSkeleton = styled.div`
  width: 200px;
  height: 32px;
  background: #2a2a2a;
  border-radius: 6px;
  margin: 8px 0 0 0;
  position: relative;
  overflow: hidden;
`;

const SkeletonStatsRow = styled.div`
  display: flex;
  gap: 64px;
  margin-top: 8px;
`;

const SkeletonStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SkeletonStatValue = styled.div`
  width: 60px;
  height: 32px;
  background: #2a2a2a;
  border-radius: 4px;
  margin-top: 2px;
  position: relative;
  overflow: hidden;
`;

const SkeletonStatLabel = styled.div`
  width: 80px;
  height: 20px;
  background: #2a2a2a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const SkeletonButton = styled.div`
  position: absolute;
  bottom: 32px;
  right: 48px;
  width: 191px;
  height: 54px;
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
`;

export default ProfileBannerSkeleton;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../services/auth/AuthContext";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../../../services/followService";
import UserIcon from "../../../assets/icons/user.svg?react";
import { formatNumber } from "../../../utils/formatNumbers";

const UserResult = ({ user, isGuestMode = false }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followers || 0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser || !user.id || currentUser.uid === user.id) {
        return;
      }

      const status = await checkFollowStatus(currentUser.uid, user.id);
      setIsFollowing(status);
    };

    checkStatus();
  }, [currentUser, user.id]);

  const handleFollow = async (e) => {
    e.stopPropagation();

    if (
      !currentUser ||
      !user.id ||
      currentUser.uid === user.id ||
      loadingFollow
    ) {
      return;
    }

    setLoadingFollow(true);

    try {
      if (isFollowing) {
        const result = await unfollowUser(currentUser.uid, user.id);
        if (result.success) {
          setIsFollowing(false);
          setFollowersCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        const result = await followUser(currentUser.uid, user.id);
        if (result.success) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error with follow operation:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUserClick = () => {
    if (user.username) {
      navigate(`/profile/${user.username}`);
    }
  };

  const isOwnProfile = currentUser && currentUser.uid === user.id;

  const showFollowButton =
    !isGuestMode && currentUser && currentUser.uid !== user.id;

  return (
    <UserCard onClick={handleUserClick}>
      <UserAvatar>
        {user.photoURL ? (
          <UserPhoto src={user.photoURL} alt={user.displayName} />
        ) : (
          <UserPhotoFallback>
            {user.displayName?.[0]?.toUpperCase() || "U"}
          </UserPhotoFallback>
        )}
      </UserAvatar>

      <UserInfo>
        <UserName>{user.displayName || "Unknown User"}</UserName>
        <UserUsername>@{user.username || "user"}</UserUsername>

        <UserStats>
          <StatItem>
            <UserIcon />
            <StatCount>{formatNumber(followersCount)}</StatCount>{" "}
          </StatItem>
          <StatItem>
            <span>{formatNumber(user.songs || 0)} songs</span>{" "}
          </StatItem>
        </UserStats>

        {showFollowButton && (
          <FollowButton
            onClick={handleFollow}
            disabled={loadingFollow}
            $isFollowing={isFollowing}
          >
            {loadingFollow ? "..." : isFollowing ? "Unfollow" : "Follow"}
          </FollowButton>
        )}
      </UserInfo>
    </UserCard>
  );
};

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #191919;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background: #212121;
    border-color: #333;
    transform: translateY(-4px);
  }
`;

const UserAvatar = styled.div`
  margin-bottom: 16px;
`;

const UserPhoto = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserPhotoFallback = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 32px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const UserName = styled.h3`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const UserUsername = styled.p`
  color: #888;
  font-size: 14px;
  margin: 0 0 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const UserStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
  font-size: 12px;

  svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;

const StatCount = styled.span`
  color: #888;
  font-size: 12px;
`;

const FollowButton = styled.button`
  background: ${({ $isFollowing }) => ($isFollowing ? "#333" : "#ff4343")};
  border: 2px solid ${({ $isFollowing }) => ($isFollowing ? "#666" : "#ff4343")};
  color: #fff;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: ${({ $isFollowing }) => ($isFollowing ? "#444" : "#e03d3d")};
    border-color: ${({ $isFollowing }) => ($isFollowing ? "#777" : "#e03d3d")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default UserResult;

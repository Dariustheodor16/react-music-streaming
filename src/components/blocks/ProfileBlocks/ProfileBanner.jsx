import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../services/auth/AuthContext";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../../../services/followService";
import { signOut } from "../../../services/auth/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase";
import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { useColorExtraction } from "../../../hooks/profile-hooks/useColorExtraction";
import ProfileBannerSkeleton from "./ProfileBannerSkeleton";
import { formatNumber } from "../../../utils/formatNumbers";

const ProfileBanner = ({
  profilePic,
  username,
  displayName,
  followers,
  following,
  songs,
  albums,
  userId,
  isOwnProfile,
  onEditClick,
  onFollowChange,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(followers);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const dropdownRef = useRef(null);

  const getProfilePicture = () => {
    if (
      profilePic &&
      profilePic.trim() !== "" &&
      profilePic.startsWith("http")
    ) {
      return profilePic;
    }
    return null;
  };

  const actualProfilePic = getProfilePicture();
  const shouldShowFallback = !actualProfilePic;

  const hasRealData =
    username &&
    displayName &&
    username.trim() !== "" &&
    displayName.trim() !== "" &&
    username !== "Username";

  const shouldExtractColors =
    hasRealData && actualProfilePic && imageLoaded && !isLoading;
  const { gradient, imgRef } = useColorExtraction(
    shouldExtractColors ? actualProfilePic : null
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    setFollowersCount(followers);
  }, [followers]);

  useEffect(() => {
    const fetchFreshFollowerCount = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFollowersCount(userData.followers || 0);
        }
      } catch (error) {
        console.error("Error fetching fresh follower count:", error);
      }
    };

    fetchFreshFollowerCount();
  }, [userId]);

  useEffect(() => {
    if (hasRealData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasRealData]);

  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser || !userId || currentUser.uid === userId) {
        return;
      }

      const status = await checkFollowStatus(currentUser.uid, userId);
      setIsFollowing(status);
    };

    checkStatus();
  }, [currentUser, userId]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleFollow = async () => {
    if (!currentUser || currentUser.uid === userId || loadingFollow) return;

    setLoadingFollow(true);

    try {
      if (isFollowing) {
        const result = await unfollowUser(currentUser.uid, userId);
        if (result.success) {
          setIsFollowing(false);
          setFollowersCount((prev) => Math.max(0, prev - 1));
          if (onFollowChange) {
            onFollowChange();
          }
        }
      } else {
        const result = await followUser(currentUser.uid, userId);
        if (result.success) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
          if (onFollowChange) {
            onFollowChange();
          }
        }
      }
    } catch (error) {
      console.error("Error with follow operation:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading || !hasRealData) {
    return <ProfileBannerSkeleton />;
  }

  return (
    <Banner style={gradient ? { background: gradient } : undefined}>
      {shouldShowFallback ? (
        <ProfileFallback>
          {displayName ? displayName[0].toUpperCase() : "U"}
        </ProfileFallback>
      ) : (
        <ProfilePic
          src={actualProfilePic}
          alt="Profile"
          crossOrigin="anonymous"
          ref={imgRef}
          onLoad={handleImageLoad}
          onError={() => {
            setImageLoaded(false);
          }}
        />
      )}
      <ProfileInfo>
        <DisplayName>{displayName}</DisplayName>
        <Username>@{username}</Username>
        <StatsRow>
          <Stat>
            <StatValue>{formatNumber(followersCount)}</StatValue>{" "}
            <StatLabel>Followers</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{formatNumber(following)}</StatValue>{" "}
            <StatLabel>Following</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{formatNumber(songs)}</StatValue>
            <StatLabel>Songs</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{formatNumber(albums)}</StatValue>{" "}
            <StatLabel>Albums</StatLabel>
          </Stat>
        </StatsRow>
      </ProfileInfo>
      <EditButtonWrapper>
        {isOwnProfile ? (
          <DropdownContainer ref={dropdownRef}>
            {" "}
            <MoreOptionsButton onClick={() => setShowDropdown(!showDropdown)}>
              ⋯
            </MoreOptionsButton>
            {showDropdown && (
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    onEditClick();
                    setShowDropdown(false);
                  }}
                >
                  Edit Profile
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>Log Out</DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        ) : currentUser && currentUser.uid !== userId ? (
          <FollowButton
            onClick={handleFollow}
            $isFollowing={isFollowing}
            disabled={loadingFollow}
          >
            {loadingFollow ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
          </FollowButton>
        ) : null}
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

  ${({ style }) =>
    style?.background
      ? `
    background: ${style.background};
    transition: background 0.5s;
  `
      : `
    background: linear-gradient(120deg, rgb(27, 35, 27) 0%, rgb(195, 226, 201) 100%);
  `}
`;

const ProfilePic = styled.img`
  width: 232px;
  height: 232px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 54px;
  margin-left: 54px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.1);
`;

const ProfileFallback = styled.div`
  width: 232px;
  height: 232px;
  border-radius: 50%;
  background: #666;
  margin-top: 54px;
  margin-left: 54px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 96px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 54px;
  margin-left: 64px;
  flex: 1;
`;

const DisplayName = styled.h1`
  font-size: 96px;
  color: #fff;
  margin: 0;
  font-weight: 800;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  line-height: 1;
`;

const Username = styled.h2`
  font-size: 32px;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0 0 0;
  font-weight: 400;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

const FollowButton = styled(PrimaryButton)`
  background: ${({ $isFollowing }) => ($isFollowing ? "#666" : "transparent")};
  border: ${({ $isFollowing }) => ($isFollowing ? "none" : "1px solid #fff")};
  color: ${({ $isFollowing }) => ($isFollowing ? "#fff" : "#fff")};
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
  width: 154px !important;
  height: 54px !important;

  &:hover {
    background: ${({ $isFollowing }) => ($isFollowing ? "#555" : "#fff")};
    color: ${({ $isFollowing }) => ($isFollowing ? "#fff" : "#000")};
    border-color: ${({ $isFollowing }) =>
      $isFollowing ? "transparent" : "#fff"};
  }

  &:disabled {
    background: #888;
    color: #fff;
    border: none;
    cursor: not-allowed;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const MoreOptionsButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 54px;
  height: 54px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  min-width: 150px;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 67, 67, 0.1);
    color: #ff4343;
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

export default ProfileBanner;

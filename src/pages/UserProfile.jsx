import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext";
import { useSongsCount } from "../hooks/profile-hooks/useSongsCount";
import { useAlbumsCount } from "../hooks/profile-hooks/useAlbumsCount";
import Navbar from "../components/blocks/Navbar/Navbar";
import ProfileBanner from "../components/blocks/ProfileBlocks/ProfileBanner";
import MusicDisplay from "../components/blocks/ProfileBlocks/MusicDisplay";
import EditProfileModal from "../components/ui/Modals/EditProfileModal";
import styled from "styled-components";
import { TIMEOUTS } from "../constants/uploadLimits";
import { userService } from "../services/api/userService";

const UserProfile = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwnProfile = currentUser && userId && currentUser.uid === userId;
  const {
    songsCount,
    loading: countLoading,
    refetch: refetchSongsCount,
  } = useSongsCount(userId);

  const {
    albumsCount,
    loading: albumsCountLoading,
    refetch: refetchAlbumsCount,
  } = useAlbumsCount(userId);
  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh && userId) {
      setTimeout(() => {
        refetchSongsCount();
        refetchAlbumsCount();
        window.history.replaceState({}, "", window.location.pathname);
      }, TIMEOUTS.REFRESH_DELAY);
    }
  }, [searchParams, userId, refetchSongsCount, refetchAlbumsCount]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) {
        setError("Username not provided");
        setLoading(false);
        return;
      }

      try {
        // const q = query(
        //   collection(firestore, "users"),
        //   where("username", "==", username.toLowerCase())
        // );
        // const querySnapshot = await getDocs(q);

        const user = await userService.getUserByUsername(username);

        if (!user) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setProfile(user);
        setUserId(user.id);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <MainWrapper>
        <Navbar />
        <LoadingState>Loading profile...</LoadingState>
      </MainWrapper>
    );
  }

  if (error) {
    return (
      <MainWrapper>
        <Navbar />
        <ErrorState>{error}</ErrorState>
      </MainWrapper>
    );
  }

  if (!profile) {
    return (
      <MainWrapper>
        <Navbar />
        <ErrorState>Profile not found</ErrorState>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <Navbar />
      <ProfileBanner
        profilePic={profile.photoURL || ""}
        username={profile.username}
        displayName={profile.displayName}
        followers={profile.followers || 0}
        following={profile.following || 0}
        songs={songsCount || 0}
        albums={albumsCount || 0}
        userId={userId}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setShowEditModal(true)}
      />
      <ContentWrapper>
        <MusicDisplay userId={userId} isOwnProfile={isOwnProfile} />
      </ContentWrapper>
      {showEditModal && (
        <EditProfileModal
          userId={userId}
          currentProfile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 70px;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #fff;
  font-size: 24px;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #ff4343;
  font-size: 24px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 32px 0;
`;

export default UserProfile;

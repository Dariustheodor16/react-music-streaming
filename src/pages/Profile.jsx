import { useEffect, useState } from "react";
import Navbar from "../components/blocks/Navbar/Navbar";
import ProfileBanner from "../components/blocks/ProfileBlocks/ProfileBanner";
import MusicDisplay from "../components/blocks/ProfileBlocks/MusicDisplay";
import EditProfileModal from "../components/blocks/Modals/EditProfileModal";
import styled from "styled-components";
import { useAuth } from "../services/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
  };

  return (
    <MainWrapper>
      <Navbar />
      <ProfileBanner
        profilePic={profile?.photoURL || "/mini-logo.svg"}
        username={profile?.displayName || "Username"}
        followers={profile?.followers || 0}
        following={profile?.following || 0}
        songs={profile?.songs || 0}
        albums={profile?.albums || 0}
        onEdit={() => setShowEditModal(true)}
      />
      <MusicDisplay />

      {showEditModal && (
        <EditProfileModal
          currentProfile={profile}
          userId={currentUser?.uid}
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

export default Profile;

import { useEffect, useState } from "react";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import ProfileBanner from "../components/blocks/ProfileBlocks/ProfileBanner";
import { useAuth } from "../services/authContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

const dummySong = {
  imageUrl: "/mini-logo.svg",
  title: "Song name",
  artist: "Artist name",
};

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

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

  return (
    <>
      <Navbar />
      <ProfileBanner
        profilePic={profile?.photoURL || "/mini-logo.svg"}
        username={profile?.displayName || "Username"}
        followers={profile?.followers || 0}
        following={profile?.following || 0}
        songs={profile?.songs || 0}
        albums={profile?.albums || 0}
        onEdit={() => alert("Edit Profile")}
      />
      <ControlBar song={dummySong} />
    </>
  );
};

export default Profile;

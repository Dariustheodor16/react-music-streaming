import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/blocks/Navbar/Navbar";
import { useAuth } from "../services/auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import styled from "styled-components";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToUserProfile = async () => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      try {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.username) {
            const urlParams = new URLSearchParams(window.location.search);
            const refresh = urlParams.get("refresh");
            const targetUrl = refresh
              ? `/profile/${userData.username}?refresh=${refresh}`
              : `/profile/${userData.username}`;

            navigate(targetUrl, { replace: true });
          } else {
            navigate("/profile-setup", { replace: true });
          }
        } else {
          navigate("/profile-setup", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    redirectToUserProfile();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <MainWrapper>
        <Navbar />
        <LoadingState>Loading...</LoadingState>
      </MainWrapper>
    );
  }

  return null;
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

export default Profile;

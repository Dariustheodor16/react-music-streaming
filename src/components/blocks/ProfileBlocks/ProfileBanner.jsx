import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";
import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase";
import { useAuth } from "../../../services/authContext";

const ProfileBanner = ({
  profilePic = "/mini-logo.svg",
  username = "Username",
  followers = 0,
  following = 0,
  songs = 0, // initial value, will be updated
  albums = 0,
  onEdit,
}) => {
  const [gradient, setGradient] = useState(
    "linear-gradient(90deg, #3a3a60 0%, #232323 100%)"
  );
  const [songsCount, setSongsCount] = useState(songs);
  const imgRef = useRef();
  const colorThief = new ColorThief();
  const { currentUser } = useAuth();

  // Fetch songs count from Firestore
  useEffect(() => {
    const fetchSongsCount = async () => {
      if (!currentUser) return;
      const q = query(
        collection(firestore, "tracks"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getCountFromServer(q);
      setSongsCount(snapshot.data().count);
    };
    fetchSongsCount();
  }, [currentUser]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const extractColor = () => {
      try {
        if (!img.complete) return;
        const color = colorThief.getColor(img);
        const colorString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        setGradient(`linear-gradient(90deg, ${colorString} 0%, #232323 100%)`);
      } catch (err) {
        setGradient("linear-gradient(90deg, #3a3a60 0%, #232323 100%)");
      }
    };

    img.addEventListener("load", extractColor);
    if (img.complete) {
      extractColor();
    }

    return () => {
      img.removeEventListener("load", extractColor);
    };
  }, [profilePic]);

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
  transition: background 0.5s;
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

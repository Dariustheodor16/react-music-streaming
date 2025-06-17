import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { usePlaylists } from "../../../../hooks/profile-hooks/usePlaylists";
import { useAuth } from "../../../../services/auth/AuthContext";
import { useCarouselScroll } from "../../../../hooks/home-hooks";
import PlaylistCarousel from "../../../ui/Carousel/PlaylistCarousel";
import CarouselControls from "../../../ui/Carousel/CarouselControls";

const UserPlaylistsSection = ({ onPlaylistPlay }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { playlists } = usePlaylists(currentUser?.uid);
  const { carouselRef, scrollStates, checkScrollPosition, scrollCarousel } =
    useCarouselScroll("userPlaylists", playlists);
  if (!playlists || playlists.length === 0) return null;

  const formattedPlaylists = playlists.map((playlist) => {
    let displayImage = "/mini-logo.svg";
    let showGrid = false;
    let gridImages = [];

    if (playlist.tracks && playlist.tracks.length > 0) {
      if (playlist.tracks.length >= 4) {
        showGrid = true;
        gridImages = playlist.tracks
          .slice(0, 4)
          .map((track) => track.imageUrl || "/mini-logo.svg");
      } else {
        displayImage = playlist.tracks[0].imageUrl || "/mini-logo.svg";
      }
    }

    return {
      ...playlist,
      id: playlist.id,
      image: displayImage,
      name: playlist.name,
      type: "playlist",
      artist: playlist.artist || "You",
      tracks: playlist.tracks,
      showGrid,
      gridImages,
    };
  });

  const handleViewMore = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Your Playlists</SectionTitle>
        <CarouselControls
          onScrollLeft={() => scrollCarousel("left")}
          onScrollRight={() => scrollCarousel("right")}
          canScrollLeft={scrollStates.userPlaylists?.left}
          canScrollRight={scrollStates.userPlaylists?.right}
        />
      </SectionHeader>
      <PlaylistCarousel
        playlists={formattedPlaylists}
        expanded={true}
        scrollKey="userPlaylists"
        onPlaylistPlay={onPlaylistPlay}
        onViewMore={handleViewMore}
        carouselRef={carouselRef}
        scrollStates={scrollStates}
        onCheckScrollPosition={checkScrollPosition}
        onScrollCarousel={scrollCarousel}
      />
    </Section>
  );
};

const Section = styled.div`
  margin-bottom: 64px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0;
`;

export default UserPlaylistsSection;

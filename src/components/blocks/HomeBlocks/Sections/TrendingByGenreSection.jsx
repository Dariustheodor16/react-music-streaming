import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  useTrendingPlaylists,
  useCarouselScroll,
} from "../../../../hooks/home-hooks";
import PlaylistCarousel from "../../../ui/Carousel/PlaylistCarousel";
import CarouselControls from "../../../ui/Carousel/CarouselControls";

const TrendingByGenreSection = ({ onPlaylistPlay, onViewMore }) => {
  const navigate = useNavigate();
  const { trendingPlaylists } = useTrendingPlaylists();
  const { carouselRef, scrollStates, checkScrollPosition, scrollCarousel } =
    useCarouselScroll("trending", trendingPlaylists);

  if (trendingPlaylists.length === 0) return null;

  const handleViewMore = (playlist) => {
    navigate(`/playlist/${playlist.id}`, {
      state: {
        playlist: playlist,
        isTemporary: true,
      },
    });
  };

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Trending</SectionTitle>
        <CarouselControls
          onScrollLeft={() => scrollCarousel("left")}
          onScrollRight={() => scrollCarousel("right")}
          canScrollLeft={scrollStates.trending?.left}
          canScrollRight={scrollStates.trending?.right}
        />
      </SectionHeader>
      <PlaylistCarousel
        playlists={trendingPlaylists.map((playlist) => ({
          ...playlist,
          showGrid: playlist.showGrid,
          gridImages: playlist.gridImages,
        }))}
        expanded={true}
        scrollKey="trending"
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

export default TrendingByGenreSection;

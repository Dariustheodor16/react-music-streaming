import { forwardRef } from "react";
import styled from "styled-components";
import Playlist from "../../blocks/MusicBlocks/Playlist";

const ExpandedPlaylist = styled(({ className, ...props }) => (
  <div className={className}>
    <Playlist {...props} />
  </div>
))`
  .playlist-card {
    width: 500px !important;

    .right-section {
      opacity: 1 !important;
      transform: translateX(0) !important;
      padding-left: 32px !important;
    }

    .heart-button,
    .play-button {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  }
`;

const PlaylistCarousel = ({
  playlists,
  expanded = false,
  scrollKey,
  onPlaylistPlay,
  onViewMore,
  carouselRef,
  scrollStates,
  onCheckScrollPosition,
  onScrollCarousel,
}) => {
  return (
    <CarouselContainer>
      <CarouselShadowLeft $show={scrollStates[scrollKey]?.left} />
      <CarouselShadowRight $show={scrollStates[scrollKey]?.right} />

      <Carousel ref={carouselRef} onScroll={onCheckScrollPosition}>
        {playlists.map((playlist) => (
          <CarouselItem key={playlist.id}>
            {expanded ? (
              <ExpandedPlaylist
                {...playlist}
                onPlay={() => onPlaylistPlay(playlist)}
                onViewMore={() => onViewMore(playlist)}
              />
            ) : (
              <Playlist
                {...playlist}
                onPlay={() => onPlaylistPlay(playlist)}
                onViewMore={() => onViewMore(playlist)}
              />
            )}
          </CarouselItem>
        ))}
      </Carousel>
    </CarouselContainer>
  );
};

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselShadowLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(
    to right,
    #232323 0%,
    rgba(35, 35, 35, 0.8) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CarouselShadowRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 60px;
  background: linear-gradient(
    to left,
    #232323 0%,
    rgba(35, 35, 35, 0.8) 70%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 3;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Carousel = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 0 16px 0;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  width: 500px;
  height: 292px;
`;

export default PlaylistCarousel;

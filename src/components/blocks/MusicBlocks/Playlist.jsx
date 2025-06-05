import styled from "styled-components";
import PlayIcon from "../../../assets/icons/play.svg?react";

const Playlist = ({
  image = "/mini-logo.svg",
  name = "Album or Playlist Name",
  type = "album",
  artist = "Artist Name",
  songs = [
    { name: "First Song" },
    { name: "Second Song" },
    { name: "Third Song" },
    { name: "Fourth Song" },
    { name: "Fifth Song" },
  ],
  onPlay,
  onViewMore,
}) => {
  return (
    <Card>
      <Left>
        <Cover src={image} alt={name} />
        <Title>{name}</Title>
        <Meta>
          <span className="type">
            {type === "album" ? "Album" : "Playlist"}
          </span>
          <span className="dot">•</span>
          <ArtistAnchor
            href="#"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              // Future: navigate to artist page here
            }}
            title={artist}
          >
            {artist}
          </ArtistAnchor>
        </Meta>
      </Left>
      <Right>
        <SongListBlock>
          <SongList>
            {songs.slice(0, 5).map((song, i) => (
              <SongRow key={i}>
                <SongMeta>
                  <SongNum>{i + 1}</SongNum>
                  <SongName
                    as="a"
                    href="#"
                    title={song.name}
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      // Future: play song here
                    }}
                  >
                    {song.name.length > 22
                      ? song.name.slice(0, 20) + "..."
                      : song.name}
                  </SongName>
                </SongMeta>
                <SongLine />
              </SongRow>
            ))}
          </SongList>
          <ViewMore onClick={onViewMore}>View more tracks</ViewMore>
        </SongListBlock>
        <PlayButton onClick={onPlay}>
          <PlayIcon />
        </PlayButton>
      </Right>
    </Card>
  );
};

const Card = styled.div`
  width: 248px;
  height: 292px;
  background: #191919;
  border-radius: 18px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  position: relative;
  transition: width 0.3s ease;
  cursor: pointer;

  &:hover {
    width: 405px;
  }
`;

const Left = styled.div`
  width: 200px;
  padding: 24px 0 0 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Cover = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  background: #232323;
`;

const Title = styled.div`
  margin-top: 6px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  .type {
    color: #a2a2a2;
    font-weight: 400;
  }
  .dot {
    color: #a2a2a2;
    font-size: 18px;
    margin: 0 4px;
  }
  .artist {
    color: #fff;
    font-weight: 400;
  }
`;

const Right = styled.div`
  flex: 1;
  padding: 24px 24px 24px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }
`;

const SongListBlock = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SongList = styled.div`
  min-height: 0;
  margin-bottom: 0;
`;

const SongRow = styled.div`
  margin-bottom: 10px;
`;

const SongMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SongNum = styled.span`
  font-size: 14px;
  color: #a2a2a2;
  min-width: 18px;
  text-align: right;
`;

const SongName = styled.a`
  font-size: 14px;
  color: #fff;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #ff4343;
  }
`;

const SongLine = styled.div`
  width: 155px;
  height: 1.5px;
  background: #a2a2a2;
  margin: 4px 0 0 0;
  border-radius: 1px;
`;

const ViewMore = styled.a`
  font-size: 14px;
  color: #fff;
  opacity: 0.8;
  margin-top: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  text-decoration: underline;
  display: inline-block;
  &:hover {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 35px;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: scale(0.8);

  ${Card}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  svg {
    width: 45px;
    height: 45px;
    fill: #fff;
    transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: scale(1.15) !important;
  }
`;

const ArtistAnchor = styled.a`
  color: #fff;
  font-weight: 400;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #ff4343;
  }
`;

export default Playlist;

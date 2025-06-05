import PlayIcon from "../../../assets/icons/mini-play.svg?react";
import PlaySecondaryIcon from "../../../assets/icons/play-secondary.svg?react";
import HeartIcon from "../../../assets/icons/empty-heart.svg?react";
import FilledHeartIcon from "../../../assets/icons/heart.svg?react";
import BrokenHeartIcon from "../../../assets/icons/broken-heart.svg?react";
import DotsIcon from "../../../assets/icons/dots.svg?react";
import AddPlaylistIcon from "../../../assets/icons/add-playlist.svg?react";
import ArtistIcon from "../../../assets/icons/artist.svg?react";
import AlbumIcon from "../../../assets/icons/album.svg?react";
import styled from "styled-components";

export const PlayIconStyled = styled(PlayIcon)`
  width: 27px;
  height: 27px;
`;

export const PlaySecondaryIconStyled = styled(PlaySecondaryIcon)`
  width: 24px;
  height: 24px;
  fill: #ff4343;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

export const HeartIconStyled = styled(HeartIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: #fff;
  transition: all 0.18s;

  &:hover {
    transform: scale(1.1);
    path {
      fill: #ff4343;
    }
  }
`;

export const FilledHeartIconStyled = styled(FilledHeartIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: #ff4343;
  transition: all 0.18s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const BrokenHeartIconStyled = styled(BrokenHeartIcon)`
  width: 29px;
  height: 29px;
  margin-right: -2px;
  cursor: pointer;
  fill: #ff4343;
  transition: all 0.18s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const DotsIconStyled = styled(DotsIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: #fff;
  transition: all 0.18s;
  outline: none;

  &:hover {
    transform: scale(1.1);
  }
`;

export const AddPlaylistIconStyled = styled(AddPlaylistIcon)`
  width: 16px;
  height: 16px;
`;

export const ArtistIconStyled = styled(ArtistIcon)`
  width: 16px;
  height: 16px;
`;

export const AlbumIconStyled = styled(AlbumIcon)`
  width: 16px;
  height: 16px;
`;

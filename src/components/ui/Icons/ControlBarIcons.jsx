import SwitchIcon from "../../../assets/icons/switch.svg?react";
import PlayIcon from "../../../assets/icons/play.svg?react";
import PauseIcon from "../../../assets/icons/pause.svg?react";
import RepeatIcon from "../../../assets/icons/repeat.svg?react";
import HeartIcon from "../../../assets/icons/empty-heart.svg?react";
import FilledHeartIcon from "../../../assets/icons/heart.svg?react";
import BrokenHeartIcon from "../../../assets/icons/broken-heart.svg?react";
import AddPlaylistIcon from "../../../assets/icons/add-playlist.svg?react";
import ShuffleIcon from "../../../assets/icons/shuffle.svg?react";
import VolumeIcon from "../../../assets/icons/volume.svg?react";
import VolumeMutedIcon from "../../../assets/icons/volume-muted.svg?react";
import styled from "styled-components";

export const SwitchIconStyled = styled(SwitchIcon)`
  width: 23.5px;
  height: 23.5px;
`;

export const SwitchIconFlipped = styled(SwitchIconStyled)`
  transform: scaleX(-1);
`;

export const FilledHeartIconStyled = styled(FilledHeartIcon)`
  width: 24px;
  height: 24px;
  fill: #ff4343;
  transition: all 0.2s ease;
`;

export const BrokenHeartIconStyled = styled(BrokenHeartIcon)`
  width: 29px;
  height: 29px;
  fill: #ff4343;
  transition: all 0.2s ease;
`;

export const VolumeIconStyled = styled(VolumeIcon)`
  width: 20px;
  height: 20px;
  fill: #585858;
  transition: fill 0.2s ease;
  cursor: pointer;

  &:hover {
    fill: #ff4343;
  }
`;

export const VolumeMutedIconStyled = styled(VolumeMutedIcon)`
  width: 20px;
  height: 20px;
  fill: #585858;
  transition: fill 0.2s ease;
  cursor: pointer;

  &:hover {
    fill: #ff4343;
  }
`;

export {
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  HeartIcon,
  AddPlaylistIcon,
  ShuffleIcon,
};

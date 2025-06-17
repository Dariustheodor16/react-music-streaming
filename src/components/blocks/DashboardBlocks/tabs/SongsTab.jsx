import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DataTable from "../common/DataTable";
import ActionButtons from "../common/ActionButtons";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import DeleteIcon from "../../../../assets/icons/delete.svg?react";

const SongsTab = ({ songs, songStats, onEditSong, onDeleteRequest }) => {
  const navigate = useNavigate();

  const columns = [
    { key: "song", label: "Song" },
    { key: "plays", label: "Plays" },
    { key: "likes", label: "Likes" },
    { key: "comments", label: "Comments" },
    { key: "actions", label: "Actions" },
  ];

  const renderRow = (song) => ({
    song: {
      image: song.image || "/mini-logo.svg",
      name: song.name,
      artist: song.artist,
      onClick: () => navigate(`/song/${song.id}`),
    },
    plays: songStats[song.id]?.plays || 0,
    likes: songStats[song.id]?.likes || 0,
    comments: songStats[song.id]?.comments || 0,
    actions: (
      <ActionButtons>
        <ActionButtons.GoTo onClick={() => navigate(`/song/${song.id}`)}>
          Go to Song
        </ActionButtons.GoTo>
        <ActionButtons.Icon onClick={() => onEditSong(song)}>
          <EditIcon />
        </ActionButtons.Icon>
        <ActionButtons.Icon
          $danger
          onClick={() =>
            onDeleteRequest({
              type: "song",
              id: song.id,
              name: song.name,
            })
          }
        >
          <DeleteIcon />
        </ActionButtons.Icon>
      </ActionButtons>
    ),
  });

  return (
    <div>
      <SectionTitle>Your Songs</SectionTitle>
      <DataTable
        columns={columns}
        data={songs}
        renderRow={renderRow}
        keyField="id"
      />
    </div>
  );
};

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
`;

export default SongsTab;

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DataTable from "../common/DataTable";
import ActionButtons from "../common/ActionButtons";
import EditIcon from "../../../../assets/icons/edit.svg?react";
import DeleteIcon from "../../../../assets/icons/delete.svg?react";

const AlbumsTab = ({ albums, albumStats, onEditAlbum, onDeleteRequest }) => {
  const navigate = useNavigate();

  const columns = [
    { key: "album", label: "Album" },
    { key: "tracks", label: "Tracks" },
    { key: "plays", label: "Plays" },
    { key: "likes", label: "Likes" },
    { key: "comments", label: "Comments" },
    { key: "actions", label: "Actions" },
  ];

  const renderRow = (album) => ({
    album: {
      image: album.image || "/mini-logo.svg",
      name: album.name,
      artist: `${album.artist} • ${album.type}`,
      onClick: () => navigate(`/album/${album.id}`),
    },
    tracks: albumStats[album.id]?.totalTracks || 0,
    plays: albumStats[album.id]?.plays || 0,
    likes: albumStats[album.id]?.likes || 0,
    comments: albumStats[album.id]?.comments || 0,
    actions: (
      <ActionButtons>
        <ActionButtons.GoTo onClick={() => navigate(`/album/${album.id}`)}>
          Go to Album
        </ActionButtons.GoTo>
        <ActionButtons.Icon onClick={() => onEditAlbum(album)}>
          <EditIcon />
        </ActionButtons.Icon>
        <ActionButtons.Icon
          $danger
          onClick={() =>
            onDeleteRequest({
              type: "album",
              id: album.id,
              name: album.name,
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
      <SectionTitle>Your Albums</SectionTitle>
      <DataTable
        columns={columns}
        data={albums}
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

export default AlbumsTab;

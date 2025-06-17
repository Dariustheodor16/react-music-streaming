import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { usePlaylist } from "../../../services/PlaylistContext";

const AddToPlaylistModal = ({ isOpen, onClose, songId, songName }) => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playlistsWithSong, setPlaylistsWithSong] = useState(new Set());
  const {
    userPlaylists,
    createPlaylist,
    addSongToPlaylist,
    fetchUserPlaylists,
  } = usePlaylist();

  useEffect(() => {
    if (isOpen) {
      fetchUserPlaylists();
    }
  }, [isOpen, fetchUserPlaylists]);

  useEffect(() => {
    if (userPlaylists.length > 0 && songId) {
      const playlistsContainingSong = new Set();

      userPlaylists.forEach((playlist) => {
        if (playlist.songIds && playlist.songIds.includes(songId)) {
          playlistsContainingSong.add(playlist.id);
        }
      });

      setPlaylistsWithSong(playlistsContainingSong);
    }
  }, [userPlaylists, songId]);

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      setIsCreating(true);
      const playlistId = await createPlaylist(newPlaylistName.trim());
      await addSongToPlaylist(playlistId, songId);
      setNewPlaylistName("");
      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToExisting = async (playlistId, playlistName) => {
    if (playlistsWithSong.has(playlistId)) return;

    try {
      await addSongToPlaylist(playlistId, songId);
      onClose();
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  };

  if (!isOpen) return null;

  const duplicateCount = playlistsWithSong.size;

  const modalContent = (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Add "{songName}" to playlist</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          <CreateSection>
            <Label>Create new playlist</Label>
            <InputRow>
              <Input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
                disabled={isCreating}
              />
              <CreateButton
                onClick={handleCreateAndAdd}
                disabled={!newPlaylistName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </CreateButton>
            </InputRow>
          </CreateSection>

          {userPlaylists.length > 0 && (
            <ExistingSection>
              <LabelRow>
                <Label>Add to existing playlist</Label>
                {duplicateCount > 0 && (
                  <StatusMessage>
                    {duplicateCount === 1
                      ? "1 playlist already contains this song"
                      : `${duplicateCount} playlists already contain this song`}
                  </StatusMessage>
                )}
              </LabelRow>

              <PlaylistList>
                {userPlaylists.map((playlist) => {
                  const alreadyHasSong = playlistsWithSong.has(playlist.id);

                  return (
                    <PlaylistItem
                      key={playlist.id}
                      onClick={() =>
                        handleAddToExisting(playlist.id, playlist.name)
                      }
                      $disabled={alreadyHasSong}
                      $hasTooltip={alreadyHasSong}
                    >
                      <PlaylistImage
                        src={playlist.imageUrl || "/mini-logo.svg"}
                        alt={playlist.name}
                        $disabled={alreadyHasSong}
                      />
                      <PlaylistInfo>
                        <PlaylistName $disabled={alreadyHasSong}>
                          {playlist.name}
                        </PlaylistName>
                        <PlaylistMeta $disabled={alreadyHasSong}>
                          {playlist.songIds?.length || 0} songs
                        </PlaylistMeta>
                      </PlaylistInfo>
                      {alreadyHasSong ? (
                        <AlreadyAddedIcon title="Song already in this playlist">
                          ✓
                        </AlreadyAddedIcon>
                      ) : (
                        <AddIcon>+</AddIcon>
                      )}
                      {alreadyHasSong && <Tooltip>Already added</Tooltip>}
                    </PlaylistItem>
                  );
                })}
              </PlaylistList>
            </ExistingSection>
          )}
        </Content>
      </Modal>
    </Overlay>
  );

  return createPortal(modalContent, document.body);
};

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusMessage = styled.div`
  color: #888;
  font-size: 12px;
  font-style: italic;
`;

const PlaylistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  border: 1px solid transparent;
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  position: relative;

  &:hover {
    background: ${({ $disabled }) =>
      $disabled ? "transparent" : "rgba(255, 255, 255, 0.05)"};
    border-color: ${({ $disabled }) =>
      $disabled ? "transparent" : "rgba(255, 67, 67, 0.3)"};
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateX(2px)")};
  }

  ${({ $hasTooltip }) =>
    $hasTooltip &&
    `
    &:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }
  `}
`;

const PlaylistImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  background: #333;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  filter: ${({ $disabled }) => ($disabled ? "grayscale(50%)" : "none")};
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PlaylistName = styled.div`
  color: ${({ $disabled }) => ($disabled ? "#666" : "#fff")};
  font-weight: 500;
  font-size: 14px;
`;

const PlaylistMeta = styled.div`
  color: ${({ $disabled }) => ($disabled ? "#555" : "#888")};
  font-size: 12px;
  margin-top: 2px;
`;

const AddIcon = styled.span`
  color: #888;
  font-size: 18px;
  font-weight: bold;
  margin-left: auto;
  transition: color 0.2s ease;

  ${PlaylistItem}:hover & {
    color: #ff4343;
  }
`;

const AlreadyAddedIcon = styled.span`
  color: #22c55e;
  font-size: 16px;
  font-weight: bold;
  margin-left: auto;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tooltip = styled.div.attrs({ className: "tooltip" })`
  position: absolute;
  right: -8px;
  top: -8px;
  background: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  border: 1px solid #555;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    right: 16px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #191919;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const CreateSection = styled.div`
  margin-bottom: 32px;
`;

const ExistingSection = styled.div``;

const Label = styled.h3`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff4343;
  }

  &::placeholder {
    color: #888;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreateButton = styled.button`
  background: #ff4343;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e03d3d;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default AddToPlaylistModal;

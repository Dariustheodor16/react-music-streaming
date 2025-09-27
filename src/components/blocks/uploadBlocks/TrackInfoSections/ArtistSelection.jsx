import styled from "styled-components";
import CloseIcon from "../../../../assets/icons/close.svg?react";
import UserSearchDropdown from "../../../ui/Inputs/UserSearchDropdown";
import { useAuth } from "../../../../services/auth/AuthContext";

const ArtistSelection = ({
  artists,
  showArtistSearch,
  setShowArtistSearch,
  handleArtistSelect,
  handleRemoveArtist,
  loading,
}) => {
  const { currentUser } = useAuth();

  const handleAddArtistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!loading) {
      setShowArtistSearch(!showArtistSearch);
    }
  };

  const handleRemoveArtistClick = (username) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleRemoveArtist(username);
  };

  const preventContainerClick = (event) => {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <MainContainer onClick={preventContainerClick}>
      <ArtistInputArea onClick={preventContainerClick}>
        {artists.map((artist) => {
          const isCurrentUser = currentUser && artist.id === currentUser.uid;
          const isOnlyArtist = artists.length === 1;
          const canRemove = !isCurrentUser;

          return (
            <ArtistChip key={artist.username} $isCurrentUser={isCurrentUser}>
              <ArtistPhoto
                src={artist.photoURL || "/mini-logo.svg"}
                alt={artist.displayName}
                onError={(e) => {
                  e.target.src = "/mini-logo.svg";
                }}
              />
              <ArtistDetails>
                <ArtistName>
                  {artist.displayName}
                  {isCurrentUser && " (You)"}
                </ArtistName>
                <ArtistHandle>@{artist.username}</ArtistHandle>
              </ArtistDetails>
              {canRemove && (
                <DeleteButton
                  type="button"
                  onClick={handleRemoveArtistClick(artist.username)}
                  title={`Remove ${artist.displayName}`}
                  tabIndex={0}
                >
                  <CloseIcon width={14} height={14} />
                </DeleteButton>
              )}
            </ArtistChip>
          );
        })}

        <AddArtistBtn
          type="button"
          onClick={handleAddArtistClick}
          disabled={loading}
          title="Add a new artist"
          tabIndex={0}
        >
          <span>+ Add Artist</span>
        </AddArtistBtn>
      </ArtistInputArea>

      {showArtistSearch && (
        <SearchContainer>
          <UserSearchDropdown
            onUserSelect={handleArtistSelect}
            excludeUsers={artists}
            placeholder="Search for artists by name or username..."
          />
        </SearchContainer>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: block;
  position: relative;
  width: fit-content;
`;

const ArtistInputArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  width: 368px;
  background: #d9d9d9;
  border-radius: 10px;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  isolation: isolate;
`;

const ArtistChip = styled.div`
  display: inline-flex;
  align-items: center;
  background: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "#4CAF50" : "#ff4343"};
  color: white;
  border-radius: 20px;
  padding: 6px 8px 6px 6px;
  font-size: 14px;
  gap: 8px;
  border: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "2px solid #2E7D32" : "none"};
  position: relative;
  isolation: isolate;
  pointer-events: none;
`;

const ArtistPhoto = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  pointer-events: none;
`;

const ArtistDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  pointer-events: none;
`;

const ArtistName = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

const ArtistHandle = styled.span`
  font-size: 10px;
  opacity: 0.8;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: all 0.15s ease;
  pointer-events: auto;
  position: relative;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  svg {
    pointer-events: none;
  }
`;

const AddArtistBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px dashed #666;
  color: #666;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
  pointer-events: auto;
  position: relative;
  z-index: 10;

  &:hover:not(:disabled) {
    border-color: #ff4343;
    color: #ff4343;
    background: rgba(255, 67, 67, 0.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #ff4343;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  span {
    pointer-events: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  z-index: 1000;
  margin-top: 8px;
  pointer-events: auto;
`;

export default ArtistSelection;

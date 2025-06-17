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

  return (
    <ArtistsSection>
      <ArtistsInputWrapper>
        {artists.map((artist) => {
          const isCurrentUser = currentUser && artist.id === currentUser.uid;
          const isOnlyArtist = artists.length === 1;

          return (
            <ArtistTag
              key={artist.username}
              $isCurrentUser={isCurrentUser}
              isOnlyArtist={isOnlyArtist}
            >
              <ArtistAvatar
                src={artist.photoURL || "/mini-logo.svg"}
                alt={artist.displayName}
              />
              <ArtistInfo>
                <ArtistDisplayName>
                  {artist.displayName}
                  {isCurrentUser && " (You)"}
                </ArtistDisplayName>
                <ArtistUsername>@{artist.username}</ArtistUsername>
              </ArtistInfo>
              {!(isCurrentUser && isOnlyArtist) && (
                <RemoveArtistBtn
                  type="button"
                  onClick={() => handleRemoveArtist(artist.username)}
                  title={
                    isCurrentUser && isOnlyArtist
                      ? "Cannot remove yourself as the only artist"
                      : "Remove artist"
                  }
                  $disabled={isCurrentUser && isOnlyArtist}
                >
                  <CloseIcon />
                </RemoveArtistBtn>
              )}
            </ArtistTag>
          );
        })}
        <AddArtistButton
          type="button"
          onClick={() => setShowArtistSearch(!showArtistSearch)}
          disabled={loading}
        >
          + Add Artist
        </AddArtistButton>
      </ArtistsInputWrapper>
      {showArtistSearch && (
        <SearchWrapper>
          <UserSearchDropdown
            onUserSelect={handleArtistSelect}
            excludeUsers={artists}
            placeholder="Search for artists by name or username..."
          />
        </SearchWrapper>
      )}
    </ArtistsSection>
  );
};
const ArtistsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ArtistsInputWrapper = styled.div`
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
`;

const ArtistTag = styled.div`
  display: flex;
  align-items: center;
  background: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "#4CAF50" : "#ff4343"};
  color: #fff;
  border-radius: 20px;
  padding: 6px 8px 6px 6px;
  font-size: 14px;
  gap: 8px;
  border: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "2px solid #2E7D32" : "none"};
`;

const RemoveArtistBtn = styled.button`
  background: none;
  border: none;
  color: #ff4343;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: rgba(255, 67, 67, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  z-index: 1000;
`;

const AddArtistButton = styled.button`
  background: transparent;
  border: 1px dashed #666;
  color: #666;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff4343;
    color: #ff4343;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ArtistAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ArtistDisplayName = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
`;

const ArtistUsername = styled.span`
  font-size: 10px;
  opacity: 0.8;
  line-height: 1;
`;

export default ArtistSelection;

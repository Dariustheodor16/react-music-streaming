import styled from "styled-components";
import { useUserSearch } from "../../../hooks/upload-hooks/useUserSearch";
import { useAuth } from "../../../services/auth/AuthContext";

const UserSearchDropdown = ({
  onUserSelect,
  excludeUsers = [],
  placeholder = "Search for artists...",
}) => {
  const { searchTerm, setSearchTerm, searchResults, loading } = useUserSearch();
  const { currentUser } = useAuth();

  const filteredResults = searchResults.filter(
    (user) =>
      !excludeUsers.some(
        (excludedUser) => excludedUser.username === user.username
      ) && user.id !== currentUser?.uid
  );

  const handleUserClick = (user) => {
    onUserSelect(user);
    setSearchTerm("");
  };

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus
      />
      {searchTerm.length >= 2 && (
        <DropdownList>
          {loading ? (
            <LoadingItem>Searching...</LoadingItem>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((user) => (
              <UserItem
                key={user.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleUserClick(user);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleUserClick(user);
                }}
              >
                <UserAvatar
                  src={user.photoURL || "/mini-logo.svg"}
                  alt={user.displayName}
                />
                <UserInfo>
                  <UserDisplayName>{user.displayName}</UserDisplayName>
                  <UserUsername>@{user.username}</UserUsername>
                </UserInfo>
              </UserItem>
            ))
          ) : (
            <NoResultsItem>No users found</NoResultsItem>
          )}
        </DropdownList>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 368px;
  z-index: 1001;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: #d9d9d9;
  color: #3d3131;
  font-size: 1rem;
  padding: 0 16px;
  box-sizing: border-box;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 67, 67, 0.3);
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1002;
  margin-top: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #333;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;

  &:hover {
    background: rgba(255, 67, 67, 0.1);
  }

  &:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const UserDisplayName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserUsername = styled.span`
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadingItem = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const NoResultsItem = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

export default UserSearchDropdown;

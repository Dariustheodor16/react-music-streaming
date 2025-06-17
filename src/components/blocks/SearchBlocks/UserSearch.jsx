import { useState, useEffect } from "react";
import { limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { userService } from "../../../services/api";
import { TIMEOUTS } from "../../../constants/uploadLimits";

const UserSearch = ({ searchTerm }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const users = await userService.searchUsers(searchTerm);
        setUsers(users);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, TIMEOUTS.DEBOUNCE_DELAY);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (loading) return <div>Searching users...</div>;
  if (!users.length) return null;

  return (
    <UsersList>
      <h3>Users</h3>
      {users.map((user) => (
        <UserItem key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
          <UserAvatar
            src={user.photoURL || "/mini-logo.svg"}
            alt={user.displayName}
          />
          <UserInfo>
            <UserName>{user.displayName}</UserName>
            <UserStats>
              {user.songs || 0} songs • {user.followers || 0} followers
            </UserStats>
          </UserInfo>
        </UserItem>
      ))}
    </UsersList>
  );
};

const UsersList = styled.div`
  margin-top: 24px;

  h3 {
    color: #fff;
    margin-bottom: 16px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 16px;
`;

const UserStats = styled.span`
  color: #999;
  font-size: 14px;
  margin-top: 2px;
`;

export default UserSearch;

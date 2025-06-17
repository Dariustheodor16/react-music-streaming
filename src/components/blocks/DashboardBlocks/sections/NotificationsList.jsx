import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNotifications } from "../../../../hooks/notification-hooks/useNotifications";
import NotificationIcon from "../../../../assets/icons/notification.svg?react";
import EmptyState from "../common/EmptyState";

const NotificationsList = ({ notifications, showAll = false, onItemClick }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotifications();

  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case "like":
        return `${notification.fromUserName} liked your ${notification.itemType}`;
      case "comment":
        return `${notification.fromUserName} commented on your ${notification.itemType}`;
      case "follow":
        return `${notification.fromUserName} started following you`;
      default:
        return "New notification";
    }
  };

  const getNotificationSubtitle = (notification) => {
    switch (notification.type) {
      case "like":
      case "comment":
        return notification.itemTitle;
      case "follow":
        return "New follower";
      default:
        return "";
    }
  };

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (onItemClick) {
      onItemClick();
    }

    if (notification.itemId && notification.itemType) {
      const path =
        notification.itemType === "song"
          ? `/song/${notification.itemId}`
          : `/album/${notification.itemId}`;
      navigate(path);
    }
  };

  if (notifications.length === 0) {
    return (
      <EmptyState
        title={showAll ? "No notifications" : "No notifications yet"}
        subtitle="You'll see notifications when people interact with your content"
      />
    );
  }

  return (
    <NotificationsListContainer>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          $unread={!notification.read}
          onClick={() => handleNotificationClick(notification)}
        >
          <NotificationIcon />
          <NotificationInfo>
            <NotificationTitle>
              {getNotificationTitle(notification)}
            </NotificationTitle>
            <NotificationSubtitle>
              {getNotificationSubtitle(notification)}
            </NotificationSubtitle>
          </NotificationInfo>
          <NotificationTime>
            {formatNotificationTime(notification.createdAt)}
          </NotificationTime>
        </NotificationCard>
      ))}
    </NotificationsListContainer>
  );
};

const NotificationsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationCard = styled.div`
  display: flex;
  align-items: center;
  background: ${({ $unread }) =>
    $unread ? "rgba(255, 67, 67, 0.1)" : "rgba(255, 255, 255, 0.02)"};
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  transition: background 0.2s ease;
  cursor: pointer;
  border-left: ${({ $unread }) =>
    $unread ? "3px solid #ff4343" : "3px solid transparent"};

  &:hover {
    background: ${({ $unread }) =>
      $unread ? "rgba(255, 67, 67, 0.15)" : "rgba(255, 255, 255, 0.05)"};
  }

  svg {
    width: 24px;
    height: 24px;
    fill: ${({ $unread }) => ($unread ? "#ff4343" : "#d9d9d9")};
    flex-shrink: 0;
  }
`;

const NotificationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 2px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NotificationSubtitle = styled.div`
  font-size: 12px;
  color: #d9d9d9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NotificationTime = styled.div`
  font-size: 12px;
  color: #a1a1a1;
  white-space: nowrap;
`;

export default NotificationsList;

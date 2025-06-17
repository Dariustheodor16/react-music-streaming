import styled from "styled-components";
import { useNotifications } from "../../../../hooks/notification-hooks/useNotifications";
import NotificationsList from "../sections/NotificationsList";

const NotificationsTab = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <div>
      <NotificationHeader>
        <SectionTitle>All Notifications</SectionTitle>
        <NotificationActions>
          {unreadCount > 0 && (
            <MarkAllReadButton onClick={handleMarkAllAsRead}>
              Mark All Read ({unreadCount})
            </MarkAllReadButton>
          )}
        </NotificationActions>
      </NotificationHeader>

      <NotificationsList notifications={notifications} showAll />
    </div>
  );
};

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MarkAllReadButton = styled.button`
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid rgba(255, 67, 67, 0.3);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ff4343;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 67, 67, 0.2);
    border-color: rgba(255, 67, 67, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export default NotificationsTab;

import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../../../hooks/notification-hooks/useNotifications";
import NotificationsList from "./NotificationsList";
import NotificationIcon from "../../../../assets/icons/notification.svg?react";
import ChevronDownIcon from "../../../../assets/icons/chevron-down.svg?react";

const NotificationsSection = ({ setActiveTab }) => {
  const { notifications, markAllAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const recentNotifications = notifications
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis
        ? a.createdAt.toMillis()
        : new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis
        ? b.createdAt.toMillis()
        : new Date(b.createdAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasMoreNotifications = notifications.length > 5;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleSeeAll = () => {
    setActiveTab("notifications");
    setIsDropdownOpen(false);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <CompactNotificationsContainer ref={dropdownRef}>
      <NotificationToggle
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        $hasNotifications={unreadCount > 0}
        $isOpen={isDropdownOpen}
      >
        <NotificationIconWrapper>
          <NotificationIcon />
          {unreadCount > 0 && (
            <NotificationBadge>{unreadCount}</NotificationBadge>
          )}
        </NotificationIconWrapper>
        <NotificationText>
          <NotificationTitle>
            Notifications {unreadCount > 0 && `(${unreadCount} new)`}
          </NotificationTitle>
          <NotificationSubtext>
            {notifications.length === 0
              ? "No notifications yet"
              : `${notifications.length} total`}
          </NotificationSubtext>
        </NotificationText>
        <ChevronIcon $isOpen={isDropdownOpen}>
          <ChevronDownIcon />
        </ChevronIcon>
      </NotificationToggle>

      {isDropdownOpen && (
        <NotificationDropdown>
          <DropdownHeader>
            <DropdownTitle>Recent Notifications</DropdownTitle>
            {unreadCount > 0 && (
              <MarkAllReadButton onClick={handleMarkAllAsRead}>
                Mark All Read
              </MarkAllReadButton>
            )}
          </DropdownHeader>

          <DropdownContent>
            <NotificationsList
              notifications={recentNotifications}
              showAll={false}
              onItemClick={handleDropdownItemClick}
            />
          </DropdownContent>

          {hasMoreNotifications && (
            <DropdownFooter>
              <SeeAllButton onClick={handleSeeAll}>
                See All Notifications ({notifications.length})
              </SeeAllButton>
            </DropdownFooter>
          )}
        </NotificationDropdown>
      )}
    </CompactNotificationsContainer>
  );
};

const CompactNotificationsContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const NotificationToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  background: ${({ $hasNotifications }) =>
    $hasNotifications
      ? "rgba(255, 67, 67, 0.05)"
      : "rgba(255, 255, 255, 0.02)"};
  border: 1px solid
    ${({ $hasNotifications }) =>
      $hasNotifications
        ? "rgba(255, 67, 67, 0.2)"
        : "rgba(255, 255, 255, 0.05)"};
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${({ $hasNotifications }) =>
      $hasNotifications
        ? "rgba(255, 67, 67, 0.08)"
        : "rgba(255, 255, 255, 0.05)"};
    border-color: ${({ $hasNotifications }) =>
      $hasNotifications
        ? "rgba(255, 67, 67, 0.3)"
        : "rgba(255, 255, 255, 0.1)"};
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: transparent;
  `}
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  margin-right: 16px;
  flex-shrink: 0;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4343;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const NotificationText = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
`;

const NotificationSubtext = styled.div`
  font-size: 14px;
  color: #888;
`;

const ChevronIcon = styled.div`
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;
  margin-left: 12px;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    fill: #888;
  }
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #191919;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: 480px;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DropdownTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const MarkAllReadButton = styled.button`
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid rgba(255, 67, 67, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #ff4343;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 67, 67, 0.2);
    border-color: rgba(255, 67, 67, 0.5);
  }
`;

const DropdownContent = styled.div`
  max-height: 300px;
  overflow-y: auto;

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

const DropdownFooter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
`;

const SeeAllButton = styled.button`
  width: 100%;
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid rgba(255, 67, 67, 0.2);
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ff4343;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 67, 67, 0.15);
    border-color: rgba(255, 67, 67, 0.3);
  }
`;

export default NotificationsSection;

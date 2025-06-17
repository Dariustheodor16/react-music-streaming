import { useState, useEffect } from "react";
import { useAuth } from "../../services/auth/AuthContext";
import { notificationService } from "../../services/api/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      try {
        const notifs = await notificationService.getUserNotifications(
          currentUser.uid
        );
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  useEffect(() => {
    const cleanupOldNotifications = async () => {
      if (!currentUser || notifications.length === 0) return;

      try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const oldReadNotifications = notifications.filter((notification) => {
          if (!notification.read) return false;

          const notificationDate = notification.createdAt?.toDate
            ? notification.createdAt.toDate()
            : new Date(notification.createdAt);

          return notificationDate < twoDaysAgo;
        });

        if (oldReadNotifications.length > 0) {
          await Promise.all(
            oldReadNotifications.map((notification) =>
              notificationService.deleteNotification(notification.id)
            )
          );

          setNotifications((prev) =>
            prev.filter(
              (n) => !oldReadNotifications.some((old) => old.id === n.id)
            )
          );
        }
      } catch (error) {
        console.error("Error cleaning up old notifications:", error);
      }
    };

    const interval = setInterval(cleanupOldNotifications, 24 * 60 * 60 * 1000);
    cleanupOldNotifications();

    return () => clearInterval(interval);
  }, [currentUser, notifications]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(currentUser.uid);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

import { useState, useEffect, useCallback } from "react";
import notificationService from "../services/notificationService";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const useNotifications = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // silent fail — notifications are non-critical
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };
    socket.on("newNotification", handler);
    return () => socket.off("newNotification", handler);
  }, [socket]);

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, fetchNotifications, markAllRead };
};

export default useNotifications;

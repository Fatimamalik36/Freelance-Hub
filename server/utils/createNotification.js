const Notification = require("../models/Notification");

/**
 * Creates a notification in DB and emits it in real-time via Socket.io if
 * the target user is currently connected.
 */
const createNotification = async ({ io, onlineUsers, user, type, message, link = "" }) => {
  const notification = await Notification.create({ user, type, message, link });

  if (io && onlineUsers) {
    const socketId = onlineUsers.get(user.toString());
    if (socketId) {
      io.to(socketId).emit("newNotification", notification);
    }
  }

  return notification;
};

module.exports = createNotification;

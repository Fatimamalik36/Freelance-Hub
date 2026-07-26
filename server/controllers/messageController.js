const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, message } = req.body;

  if (!receiver || !message) {
    res.status(400);
    throw new Error("Receiver and message are required");
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    message,
  });

  const populated = await newMessage.populate("sender", "name profileImage");

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");
  const socketId = onlineUsers.get(receiver.toString());
  if (socketId) {
    io.to(socketId).emit("receiveMessage", populated);
  }

  await createNotification({
    io,
    onlineUsers,
    user: receiver,
    type: "new_message",
    message: `New message from ${req.user.name}`,
    link: `/messages`,
  });

  res.status(201).json({ success: true, message: populated });
});

// @desc    Get conversation between logged in user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name profileImage")
    .populate("receiver", "name profileImage");

  await Message.updateMany(
    { sender: req.params.userId, receiver: req.user._id, read: false },
    { read: true }
  );

  res.json({ success: true, messages });
});

// @desc    Get list of conversations (inbox)
// @route   GET /api/messages
// @access  Private
const getInbox = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name profileImage")
    .populate("receiver", "name profileImage");

  const conversationsMap = new Map();

  messages.forEach((msg) => {
    const otherUser =
      msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
    const key = otherUser._id.toString();

    if (!conversationsMap.has(key)) {
      conversationsMap.set(key, {
        user: otherUser,
        lastMessage: msg.message,
        lastMessageAt: msg.createdAt,
        unread:
          msg.receiver._id.toString() === userId.toString() && !msg.read ? 1 : 0,
      });
    } else if (
      msg.receiver._id.toString() === userId.toString() &&
      !msg.read
    ) {
      conversationsMap.get(key).unread += 1;
    }
  });

  res.json({ success: true, conversations: Array.from(conversationsMap.values()) });
});

module.exports = { sendMessage, getConversation, getInbox };

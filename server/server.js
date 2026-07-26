const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Track online users: userId -> socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  socket.on("typing", ({ receiverId, senderId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", { senderId });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FreelanceHub API is running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 FreelanceHub server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const communityRoutes = require("./routes/communityRoutes");
const eventRoutes = require("./routes/eventRoutes");
const messageRoutes = require("./routes/messageRoutes");
const workerRoutes = require("./routes/workerRoutes");

const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Message = require("./models/Message")
const app = express();
const superadminRoutes = require("./routes/superadminRoutes")
// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/communities", communityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes); // Add messages route
app.use("/api/superadmin", superadminRoutes)
app.use("/api/workers", workerRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your frontend to connect
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a community room
  socket.on("joinCommunity", (communityId) => {
    socket.join(communityId);
    console.log(`User joined community room: ${communityId}`);
  });

  // Send message to a specific community
  socket.on("sendMessage", ({ communityId, message }) => {
    console.log(`Message received in community ${communityId}:`, message);
    io.to(communityId).emit("receiveMessage", message);
  });

  // Handle typing events
  socket.on("typing", ({ communityId, username }) => {
    console.log(`${username} is typing in community ${communityId}`);
    socket.to(communityId).emit("userTyping", username); // Broadcast to all except the sender
  });


  // Join a personal room (userId-based)
  socket.on("joinUser", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private chat room`);
  });

  // Handle direct messages
  socket.on("sendPrivateMessage", async ({ sender, receiver, message }) => {
    try {
      // Save message to MongoDB
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // Emit message to the receiver's room
      io.to(receiver).emit("receivePrivateMessage", {
        sender,
        message,
        timestamp: newMessage.timestamp,
      });

      console.log(`Message from ${sender} to ${receiver}: ${message}`);
    } catch (error) {
      console.error("Error sending private message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`ðŸš€ Server running on port ${PORT}`));

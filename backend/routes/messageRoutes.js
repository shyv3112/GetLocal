const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

// Get chat history between two users
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Current logged-in user
    const otherUserId = req.params.userId; // Other participant

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); // Sort by oldest first

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

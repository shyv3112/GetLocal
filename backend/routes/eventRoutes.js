const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Event = require("../models/Event");
const User = require("../models/User");

// Create a new event (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can create events" });
    }

    const { name, description } = req.body;
    const admin = req.user.id;

    const event = new Event({ name, description, admin, users: [{ id: admin, attending: true }] });
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Show all events for users (Basic event details)
router.get("/user-events", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().populate("users.id")
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Show all events for admins (With attending users)
router.get("/admin-events", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can view this" });
    }

    const events = await Event.find()
      .populate("users.id", "name email")
      .populate("admin", "name email");

    res.json(events);
  } catch (error) {
    console.error("Error fetching admin events:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Allow users to join an event and update attending status
router.post("/join/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { attending } = req.body; // true or false
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already in the event
    const userIndex = event.users.findIndex(user => user.id.toString() === userId);
    
    if (userIndex !== -1) {
      // Update existing attending status
      event.users[userIndex].attending = attending;
    } else {
      // Add user to event
      event.users.push({ id: userId, attending });
    }

    await event.save();
    res.json({ message: "Attendance updated", event });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;

const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourquizscore@gmail.com",
    pass: "abme otcu emzj dael",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Service Booking" <your-email@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};

// Create a booking request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { workerId, service, date, time, isEmergency } = req.body; // Ensure isEmergency is included

    const resident = await User.findById(req.user.id);
    const worker = await User.findById(workerId);

    if (!resident || !worker) {
      return res.status(404).json({ message: "Resident or Worker not found" });
    }

    const booking = new Booking({ resident: req.user.id, worker: workerId, service, date, time, isEmergency });
    await booking.save();

    const subject = "New Booking Request!";
    const text = `Hello ${worker.name},\n\nYou have received a new booking request for the service: "${service}" from ${resident.name} on ${date} for ${time}.\n\nPlease check your dashboard for details.\n\nBest,\nThe Team`;
    sendEmail(worker.email, subject, text);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all workers
router.get("/workers", async (req, res) => {
  try {
    const workers = await User.find({ role: "Worker" }).populate("ratings.resident", "name");
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get all bookings for a worker
router.get("/worker", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ worker: req.user.id }).populate("resident");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching worker bookings:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all bookings for a resident
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ resident: req.user.id }).populate("worker");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching resident bookings:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Accept/Reject Booking
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("resident worker");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status; // "Accepted" or "Rejected"
    await booking.save();

    const subject = `Your Booking Has Been ${booking.status}`;
    const text = `Hello ${booking.resident.name},\n\nYour booking request for "${booking.service}" has been ${booking.status.toLowerCase()} by ${booking.worker.name}.\n\nBest,\nThe Team`;
    sendEmail(booking.resident.email, subject, text);

    res.json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Rate a worker
router.put("/workers/:workerId/rate", authMiddleware, async (req, res) => {
  const { rating, review } = req.body;
  const { workerId } = req.params;

  console.log("Received rating:", rating, "for worker ID:", workerId); // Debugging line

  try {
    const worker = await User.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Add the new rating
    worker.ratings.push({ resident: req.user.id, rating, review });
    await worker.save();

    console.log("Updated ratings for worker:", worker.ratings); // Debugging line

    res.json({ message: "Rating submitted successfully", ratings: worker.ratings });
  } catch (error) {
    console.error("Error saving rating:", error); // Debugging line
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
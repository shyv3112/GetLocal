const express = require("express");
const User = require("../models/User"); // Adjust the path as necessary
const authMiddleware = require("../middleware/authMiddleware"); // Ensure you have authentication middleware
const router = express.Router();

// Get all workers
router.get("/workers", async (req, res) => {
  try {
    const workers = await User.find({ role: "Worker" }).populate("ratings.resident", "name");
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Submit a rating for a worker
router.put("/:workerId/rate", authMiddleware, async (req, res) => {
  const { rating, review } = req.body;
  const { workerId } = req.params;

  try {
    const worker = await User.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    // Add the new rating
    worker.ratings.push({ resident: req.user.id, rating, review });
    await worker.save();

    res.json({ message: "Rating submitted successfully", ratings: worker.ratings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
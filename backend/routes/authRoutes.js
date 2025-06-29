const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware")

// Set up storage for proof images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });


// Fetch all users (excluding the current user)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // Get the logged-in user's ID
    const users = await User.find({ _id: { $ne: loggedInUserId }, role: "Resident" }).select("name email _id");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Worker Details (Phone, Shop, Proof, Services)
router.put("/complete", authMiddleware, upload.fields([{ name: "proof" }, { name: "profile" }]), async (req, res) => {
  try {
    const { phone, shop, services } = req.body;
    const proof = req.files.proof ? `/uploads/${req.files.proof[0].filename}` : undefined;
    const profile = req.files.profile ? `/uploads/${req.files.profile[0].filename}` : undefined;


    // Ensure `services` is an array
    const servicesArray = services ? services.split(",").map(s => s.trim()) : undefined;

    // Allowed fields for update
    const updatedFields = {};
    if (shop) updatedFields.shop = shop;
    if (phone) updatedFields.phone = phone;
    if (proof) updatedFields.proof = proof;
    if (profile) updatedFields.profile = profile;
    
    if (servicesArray) updatedFields.services = servicesArray;

    // Find user and update
    console.log("Decoded User:", req.user); // ✅ Debug user info
    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (default not verified)
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Signup successful. Await admin approval.",token, newUser});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Worker verification
    if (user.role === "Worker") {
      user.verified = true;
      await user.save(); // Save the updated user document
    }

    if (!user.verified) return res.status(403).json({ message: "Account not verified by admin!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Admin Approval Route
router.put("/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all unverified users (Only for Admins)
router.get("/pending-users", async (req, res) => {
  try {
    const users = await User.find({ verified: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
// Get all services for the logged-in worker
router.get("/services", authMiddleware, async (req, res) => {
  try {
    const worker = await User.findById(req.user.id);
    if (!worker || worker.role !== "Worker") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(worker.services || []);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new service for the worker (with price & available time slots)
router.post("/services", authMiddleware, async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    
    const { name, price, availableTimes } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const worker = await User.findById(req.user.id);
    if (!worker || worker.role !== "Worker") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    worker.services.push({ name, price, availableTimes });
    await worker.save();
    
    console.log("Updated worker services:", worker.services);
    
    res.json({ message: "Service added successfully", services: worker.services });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a service by index
router.delete("/services/:serviceIndex", authMiddleware, async (req, res) => {
  try {
    const worker = await User.findById(req.user.id);
    if (!worker || worker.role !== "Worker") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const serviceIndex = parseInt(req.params.serviceIndex);
    if (serviceIndex < 0 || serviceIndex >= worker.services.length) {
      return res.status(400).json({ message: "Invalid service index" });
    }
    
    worker.services.splice(serviceIndex, 1);
    await worker.save();
    
    res.json({ message: "Service removed successfully", services: worker.services });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;

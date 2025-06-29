const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const nodemailer = require("nodemailer"); // ✅ Import Nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail", // Change if using another provider
  auth: {
    user: "yourquizscore@gmail.com", // ✅ Your Gmail
    pass: "abme otcu emzj dael", // ✅ Your App Password (NOT your Gmail password)
  },
});



// Get all  users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Get all pending users
router.get("/pending-users", authMiddleware, async (req, res) => {
  try {
    const pendingUsers = await User.find({ role:"Admin",verified: false }).select("-password");
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Approve or reject user
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    const { action } = req.body; // "approve" or "reject"
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let emailSubject = "";
    let emailText = "";

    if (action === "approve") {
      user.verified = true;
      await user.save();

      emailSubject = "Your Account Has Been Approved!";
      emailText = `Hello ${user.name},\n\nCongratulations! Your account has been approved. You can now log in and start using our services.\n\nBest regards,\nThe Team`;
      
      res.json({ message: "User approved and email sent!" });
    } else if (action === "reject") {
      await User.findByIdAndDelete(req.params.id);

      emailSubject = "Your Account Has Been Rejected";
      emailText = `Hello ${user.name},\n\nWe regret to inform you that your account request has been rejected. If you think this was a mistake, please contact support.\n\nBest regards,\nThe Team`;

      res.json({ message: "User rejected and email sent!" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // ✅ Send Email
    await transporter.sendMail({
      from: '"Admin Team" <your-email@gmail.com>',
      to: user.email,
      subject: emailSubject,
      text: emailText,
    });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Fetch all residents
router.get("/residents", async (req, res) => {
  try {
    const residents = await User.find({ role: "Resident" }, "name _id"); // Fetch only name and _id
    res.status(200).json(residents);
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;

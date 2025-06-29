const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/multer");
const nodemailer = require("nodemailer"); 
const User = require("../models/User"); // Import User model

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourquizscore@gmail.com", // ✅ Your Email
    pass: "abme otcu emzj dael", // ✅ Your App Password (NOT your Gmail password)
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"High Priority Post" <your-email@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};


router.use("/uploads", express.static("uploads"));

// Create Post with Image Upload
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { description, location, latitude, longitude, priority, isMapVisible } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Convert to boolean values
    const isHighPriority = priority === "true" || priority === true;
    const mapVisibility = isMapVisible === "true" || isMapVisible === true;

    let post = new Post({ 
      user: req.user.id, 
      description, 
      image,
      location,
      latitude: mapVisibility ? latitude : null, // Only store if map is visible
      longitude: mapVisibility ? longitude : null, // Only store if map is visible
      isMapVisible: mapVisibility,
      priority: isHighPriority 
    });
    
    post = await post.save();
    post = await Post.findById(post._id).populate("user", "name");

    if (isHighPriority) {
      const users = await User.find({}, "email");
      const to = users.map((user) => user.email).join(", ");
      const subject = "🚨 New High Priority Post";
      const text = `A new high priority post has been created:\n\n${description}\n\nLocation: ${location}\n\nPlease check it out!`;
      await sendEmail(to, subject, text);
    }

    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profile")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 }); // ✅ Sort by latest posts

      
    res.json(
      posts.map((post) => ({
        ...post.toObject(),
        image: post.image ? `http://localhost:5000${post.image}` : null, // ✅ Append server URL for images
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.user.id, text: req.body.text };
    post.comments.push(comment);
    await post.save();

    // ✅ Fetch the updated post with populated comments
    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.json(updatedPost);
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get posts by current user
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .populate("user", "name profile")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(
      posts.map((post) => ({
        ...post.toObject(),
        image: post.image ? `http://localhost:5000${post.image}` : null,
      }))
    );
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update post
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { description, location, priority } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    post.description = description || post.description;
    post.location = location || post.location;
    post.priority = priority || post.priority;

    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    if (priority) {
      const users = await User.find({}, "email");
      const to = users.map((user) => user.email).join(", ");
      const subject = "🚨 New High Priority Post";
      const text = `A new high priority post has been created:\n\n${description}\n\nLocation: ${location}\n\nPlease check it out!`;
      await sendEmail(to, subject, text);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Updated delete post route
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Use deleteOne() instead of remove()
    await Post.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Post removed successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});
module.exports = router;
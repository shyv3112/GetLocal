const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  latitude: { type: Number },  // ✅ Store latitude
  longitude: { type: Number }, // ✅ Store longitude
  isMapVisible:{type:Boolean},
  priority: {type: Boolean, default:false},
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);

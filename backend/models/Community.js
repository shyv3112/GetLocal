// models/Community.js
const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Community name
  description: { type: String }, // Optional description
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who created the community
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users in the community
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Community", CommunitySchema);
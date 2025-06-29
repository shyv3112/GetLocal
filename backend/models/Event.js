
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  users: [
    { 
      id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      attending: {type:Boolean}
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model( "Event", EventSchema );
// const mongoose = require('mongoose');

// const ratingSchema = new mongoose.Schema({
//   resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   review: { type: String }
// });

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['Resident', 'Worker', 'Admin', 'SuperAdmin'], required: true },
//   phone: { type: String },
//   shop: { type: String },
//   verified: { type: Boolean, default: true },
//   services: [
//     {
//       name: { type: String, required: true },
//       price: { type: Number, required: true },
//       availableTimes: { type: String, required: true }
//     }
//   ],
//   ratings: [ratingSchema]
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Resident", "Worker", "Admin","SuperAdmin"], required: true },
  phone: { type: String},
  shop: { type: String},
  services: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      availableTimes: { type: String, required: true },
    },
  ],
  ratings: [ratingSchema],
  nearby:{type:Boolean, default:true},
  proof: { type: String},
  profile:{type:String},
  verified: { type: Boolean, default: true },  // ✅ New field to track verification

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
// models/User.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";            // optional, but handy for URLs

const AVAILABILITY_ENUM = [
  "weekdays-day",
  "weekdays-evening",
  "weekends",
];

const userSchema = new mongoose.Schema(
  {
    googleID: {
      type: String,
      unique: true,
      required: [true, "Google ID cannot be empty"],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email ID cannot be empty"],
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name cannot be empty"],
    },
    profileIMG: {
      type: String,
      required: [true, "Image is required"],
    },
    refreshToken: String,
    location: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      default: "",
    },
    skillsOffered: {
      type: [String],
      default: [],
      index: true,
    },
    skillsWanted: {
      type: [String],
      default: [],
      index: true,
    },
    availability: {
      type: [String],
      enum: AVAILABILITY_ENUM,
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.index(
  {
    skillsOffered: "text",
    skillsWanted: "text",
    name: "text",
    location: "text",
  },
  { name: "user_text_search" }
);

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export default mongoose.model("User", userSchema);

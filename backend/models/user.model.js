// models/User.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";            // optional, but handy for URLs

const AVAILABILITY_ENUM = [
  "available",
  "busy", 
  "away"
];

const SKILL_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

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
      type: [{
        name: { type: String, required: true },
        level: { type: String, enum: SKILL_LEVELS, default: "intermediate" },
        experience: { type: Number, default: 0 }, // years of experience
        description: { type: String, default: "" }
      }],
      default: [],
      index: true,
    },
    skillsWanted: {
      type: [{
        name: { type: String, required: true },
        level: { type: String, enum: SKILL_LEVELS, default: "beginner" },
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
      }],
      default: [],
      index: true,
    },
    availability: {
      type: String,
      enum: AVAILABILITY_ENUM,
      default: "available",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
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

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const createSampleUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Sample users data
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        skills: ["JavaScript", "React", "Node.js"],
        isBanned: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        skills: ["Python", "Django", "Machine Learning"],
        isBanned: false,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        skills: ["Java", "Spring Boot", "Android"],
        isBanned: true,
      },
      {
        name: "Alice Brown",
        email: "alice@example.com",
        password: "password123",
        skills: ["Vue.js", "CSS", "UI/UX"],
        isBanned: false,
      },
      {
        name: "Charlie Wilson",
        email: "charlie@example.com",
        password: "password123",
        skills: ["Go", "Docker", "Kubernetes"],
        isBanned: false,
      },
      {
        name: "Diana Garcia",
        email: "diana@example.com",
        password: "password123",
        skills: ["PHP", "Laravel", "MySQL"],
        isBanned: false,
      },
      {
        name: "Eve Martinez",
        email: "eve@example.com",
        password: "password123",
        skills: ["C#", ".NET", "Azure"],
        isBanned: true,
      },
      {
        name: "Frank Lee",
        email: "frank@example.com",
        password: "password123",
        skills: ["Ruby", "Rails", "PostgreSQL"],
        isBanned: false,
      }
    ];

    // Check if users already exist
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log(`${existingUsers.length} users already exist. Skipping sample user creation.`);
      process.exit(0);
    }

    // Create sample users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    console.log(`Successfully created ${sampleUsers.length} sample users!`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating sample users:", error);
    process.exit(1);
  }
};

createSampleUsers(); 
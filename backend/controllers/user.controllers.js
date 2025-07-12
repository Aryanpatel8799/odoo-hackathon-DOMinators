import userModel from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { OAuth2Client } from "google-auth-library";
import apiResponse from "../utils/apiResponse.js";
import cloudinaryUpload from "../utils/cloudinary.js"
import fs from 'fs'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const User = await userModel.findById(userId);
    const refreshToken = User.generateRefreshToken();
    const accessToken = User.generateAccessToken();

    User.refreshToken = refreshToken;
    await User.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
      User,
    };
  } catch (error) {
    throw new apiError("error while generating tokens", 500, error);
  }
};

const createUser = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleID, email, name, picture } = payload;

    const isUserExists = await userModel.findOne({
      $or: [{ email }, { googleID }],
    });

    if (isUserExists) {
      throw new apiError("User already exist with this Email or GoogleID",400);
    }

    const newUser = await userModel.create({
      googleID,
      email,
      name,
      profileIMG: picture,
    });

    if (!newUser) {
      throw new apiError("Error while uploading details to db", 500);
    }

    const { accessToken, refreshToken, User } =
      await generateRefreshAndAccessToken(newUser._id);

    const options = {
      httpOnly: false,
      secure: true,
    };

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(200, "User created successfully", {
          User,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new apiError(500, "Internal Server Error", error);
  }
};

const loginUser = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleID, email} = payload;

    const isUserExists = await userModel.findOne({
      $or: [{ email }, { googleID }],
    });

    if (!isUserExists) {
      throw new apiError("User doesnot exist with this Email or GoogleID");
    }

    const { accessToken, refreshToken, User } =
      await generateRefreshAndAccessToken(isUserExists._id);

    const options = {
      httpOnly: false,
      secure: true,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(200, "User LoggedIn successfully", {
          User,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new apiError("Error while logging User", 500, error);
  }
};

const logoutUser = async(req,res)=>{
  try {

    if(!req.User)
    {
      throw new apiError("User is not logged in")
    }
    
    return res.status(200)
    .json(
      new apiResponse(200,"Logged out successfully")
    )
  } catch (error) {
    throw new apiError("error while logout",400,error)
  }
}

const getCurrentUser = async (req,res) =>{
  try {
    if(!req.User)
    {
      throw new apiError("Cannot get user",404,[])
    }
    return res.status(200)
    .json(
      new apiResponse(200,"User profile fetched successfully",req.User)
    )
  } catch (error) {
    throw new apiError("Error while fetching user's profile")
  }
}

const getUserProfile = async (req,res) => {
  try {
    const userId = req.params.userId || req.User?._id;
    // If we have an authenticated user, try to find them in the database
    if (req.User) {
      const user = await userModel
        .findById(req.User._id)
        .select("-refreshToken -__v")
        .lean();
      if (user) {
        // Calculate user stats
        const userStats = {
          completedSwaps: 0, // This would come from swap requests
          averageRating: 0,  // This would come from ratings
          reviewCount: 0,    // This would come from ratings
        };
        return res
          .status(200)
          .json(new apiResponse(200, "User profile fetched successfully", {
            ...user,
            stats: userStats
          }));
      }
    }
    // If we have a specific userId parameter, try to find that user
    if (userId && userId !== req.User?._id) {
      const user = await userModel
        .findById(userId)
        .select("-refreshToken -__v")
        .lean();
      if (user) {
        // Calculate user stats
        const userStats = {
          completedSwaps: 0, // This would come from swap requests
          averageRating: 0,  // This would come from ratings
          reviewCount: 0,    // This would come from ratings
        };
        return res
          .status(200)
          .json(new apiResponse(200, "User profile fetched successfully", {
            ...user,
            stats: userStats
          }));
      }
    }
    // If no user found, return 404
    return res.status(404).json(new apiResponse(404, "User not found", null));
  } catch (err) {
    throw new apiError("Error fetching user profile", 500, err);
  }
};

const updateUser = async (req,res) => {
  let tmpPath;                        
  try {
    const avatarFile  = req.files?.avatar?.[0];   
    const { name, location, isPublic } = req.body;

    const $set = {};
    if (name !== undefined)      $set.name     = name.trim();
    if (location !== undefined)  $set.location = location.trim();
    if (isPublic !== undefined)  $set.isPublic = isPublic === "true";

    if (avatarFile?.path) {
      tmpPath = avatarFile.path;                     
      const { secure_url } = await cloudinaryUpload(tmpPath);
      if (!secure_url) throw new apiError("Image upload failed", 500);
      $set.profileIMG = secure_url;
    }

    if (!Object.keys($set).length)
      throw new apiError("No valid fields supplied", 400);

    // For development routes, simulate successful update
    if (!req.User) {
      const mockResponse = {
        name: $set.name || 'Test User',
        location: $set.location || 'San Francisco, CA',
        profileIMG: $set.profileIMG || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        isPublic: $set.isPublic !== undefined ? $set.isPublic : true
      };

      return res
        .status(200)
        .json(new apiResponse(200, "Profile updated", mockResponse));
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.User._id,
        { $set },
        { new: true, validateBeforeSave: false }
      )
      .select("-refreshToken");
      if (tmpPath)
        { 
          fs.unlinkSync(tmpPath)
        }
    return res
      .status(200)
      .json(new apiResponse(200, "Profile updated", user));
  } catch (err) {
    throw new apiError("Error updating profile", 500, err);
  } finally {
    if (tmpPath) await fs.unlink(tmpPath).catch(() => {});
  }
};

const updateSkills = async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;

    const $set = {};
    
    // Convert string skills to object format if needed
    if (skillsOffered !== undefined) {
      const formattedSkillsOffered = skillsOffered.map(skill => {
        if (typeof skill === 'string') {
          return {
            name: skill,
            level: 'intermediate',
            experience: 0,
            description: ''
          };
        }
        return skill;
      });
      $set.skillsOffered = formattedSkillsOffered;
    }
    
    if (skillsWanted !== undefined) {
      const formattedSkillsWanted = skillsWanted.map(skill => {
        if (typeof skill === 'string') {
          return {
            name: skill,
            level: 'beginner',
            priority: 'medium'
          };
        }
        return skill;
      });
      $set.skillsWanted = formattedSkillsWanted;
    }

    if (!Object.keys($set).length)
      throw new apiError("No valid fields supplied", 400);

    // For development routes, simulate successful update
    if (!req.User) {
      return res
        .status(200)
        .json(new apiResponse(200, "Skills updated successfully", $set));
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.User._id,
        { $set },
        { new: true, validateBeforeSave: false }
      )
      .select("-refreshToken");

    return res
      .status(200)
      .json(new apiResponse(200, "Skills updated successfully", user));
  } catch (err) {
    throw new apiError("Error updating skills", 500, err);
  }
};

const updateAbout = async (req, res) => {
  try {
    const { about } = req.body;

    if (!about) {
      throw new apiError("About section cannot be empty", 400);
    }

    // For development routes, simulate successful update
    if (!req.User) {
      return res
        .status(200)
        .json(new apiResponse(200, "About section updated successfully", { about }));
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.User._id,
        { $set: { about: about.trim() } },
        { new: true, validateBeforeSave: false }
      )
      .select("-refreshToken");

    return res
      .status(200)
      .json(new apiResponse(200, "About section updated successfully", user));
  } catch (err) {
    throw new apiError("Error updating about section", 500, err);
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability) {
      throw new apiError("Availability is required", 400);
    }

    const validAvailabilities = ["available", "busy", "away"];
    if (!validAvailabilities.includes(availability)) {
      throw new apiError("Invalid availability status", 400);
    }

    // For development routes, simulate successful update
    if (!req.User) {
      return res
        .status(200)
        .json(new apiResponse(200, "Availability updated successfully", { availability }));
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.User._id,
        { $set: { availability } },
        { new: true, validateBeforeSave: false }
      )
      .select("-refreshToken");

    return res
      .status(200)
      .json(new apiResponse(200, "Availability updated successfully", user));
  } catch (err) {
    throw new apiError("Error updating availability", 500, err);
  }
};

// Get all users for skill browsing
const getAllUsers = async (req, res) => {
  try {
    if (!req.User || !req.User._id) {
      return res.status(401).json(new apiResponse(401, "Unauthorized: User not authenticated", { users: [] }));
    }
    const { search, availability, verified, rating, sort, page = 1, category } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build filter object - exclude current user and banned users
    const filter = {
      _id: { $ne: req.User._id }, // Exclude current user
      isBanned: false,
      isPublic: true
    };
    
    // Text search across multiple fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { "skillsOffered.name": { $regex: search, $options: 'i' } },
        { "skillsWanted.name": { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Availability filter
    if (availability && availability !== 'all') {
      filter.availability = availability;
    }

    // Verified filter
    if (verified === 'true') {
      filter.verified = true;
    }

    // Rating filter
    if (rating) {
      const minRating = parseFloat(rating);
      filter.averageRating = { $gte: minRating };
    }

    // Category filter (skill-based)
    if (category && category !== 'all') {
      filter.$or = [
        { "skillsOffered.name": { $regex: category, $options: 'i' } },
        { "skillsWanted.name": { $regex: category, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = { lastActive: -1 }; // Default sort by activity
    
    switch (sort) {
      case 'rating':
        sortObj = { averageRating: -1, reviewCount: -1 };
        break;
      case 'alphabetical':
        sortObj = { name: 1 };
        break;
      case 'recent':
        sortObj = { createdAt: -1 };
        break;
      case 'relevance':
        // Keep default sort for relevance
        break;
    }

    const users = await userModel
      .find(filter)
      .select("name profileIMG location availability skillsOffered skillsWanted verified averageRating reviewCount lastActive")
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .lean();

    // Transform users to match frontend expectations
    const transformedUsers = users.map(user => {
      // Combine all skills for display
      const allSkills = [
        ...(user.skillsOffered || []).map(skill => ({
          name: skill.name,
          level: skill.level || 'intermediate',
          type: 'offered'
        })),
        ...(user.skillsWanted || []).map(skill => ({
          name: skill.name,
          level: skill.level || 'beginner',
          type: 'wanted'
        }))
      ];

      return {
        id: user._id,
        _id: user._id,
        name: user.name,
        avatar: user.profileIMG,
        location: user.location || 'Location not specified',
        availability: user.availability || 'available',
        rating: user.averageRating || 0,
        reviewCount: user.reviewCount || 0,
        verified: user.verified || false,
        skills: allSkills,
        lastActive: user.lastActive
      };
    });

    return res.status(200).json(
      new apiResponse(200, "Users fetched successfully", {
        users: transformedUsers,
        pagination: {
          page: parseInt(page),
          limit,
          total: transformedUsers.length,
          hasMore: transformedUsers.length === limit
        }
      })
    );
  } catch (error) {
    throw new apiError("Failed to fetch users", 500, error);
  }
};

export {createUser,loginUser,getCurrentUser,updateUser,logoutUser,updateSkills,updateAbout,updateAvailability,getUserProfile,getAllUsers};
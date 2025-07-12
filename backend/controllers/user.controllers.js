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


export {createUser,loginUser,getCurrentUser,updateUser,logoutUser};
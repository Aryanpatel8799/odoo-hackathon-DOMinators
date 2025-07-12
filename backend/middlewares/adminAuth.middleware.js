import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import apiError from "../utils/apiError.js";

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError("Unauthorized request", 401);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decodedToken._id).select("-password -refreshToken");

    if (!admin) {
      throw new apiError("Invalid access token", 401);
    }

    if (!admin.isActive) {
      throw new apiError("Admin account is deactivated", 401);
    }

    req.Admin = admin;
    next();
  } catch (error) {
    throw new apiError("Invalid access token", 401, error);
  }
};

export default adminAuthMiddleware; 
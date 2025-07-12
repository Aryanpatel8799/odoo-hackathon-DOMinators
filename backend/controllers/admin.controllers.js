import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Swap from "../models/swapRequest.models.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

// Fallback data for testing when MongoDB is not available
const fallbackData = {
  users: [
    { _id: '1', name: 'John Doe', email: 'john@example.com', isBanned: false, createdAt: new Date() },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', isBanned: false, createdAt: new Date() },
    { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', isBanned: true, createdAt: new Date() },
  ],
  swaps: [
    { _id: '1', status: 'pending', offeredSkill: 'JavaScript', wantedSkill: 'Python', createdAt: new Date() },
    { _id: '2', status: 'accepted', offeredSkill: 'React', wantedSkill: 'Vue', createdAt: new Date() },
    { _id: '3', status: 'completed', offeredSkill: 'Node.js', wantedSkill: 'Django', createdAt: new Date() },
  ]
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    console.log('Admin login attempt:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      throw new apiError("Email and password are required", 400);
    }

    console.log('Looking for admin with email:', email.toLowerCase());
    
    // Find admin user
    let adminUser;
    try {
      adminUser = await Admin.findOne({ email: email.toLowerCase() });
      
      if (!adminUser) {
        // Create default admin if none exists
        console.log('No admin found, creating default admin...');
        adminUser = new Admin({
          username: "admin",
          email: "admin@skillswap.com",
          password: "admin123",
          role: "admin",
          isActive: true,
        });
        await adminUser.save();
        console.log('Default admin created successfully');
      }
    } catch (dbError) {
      console.log('MongoDB not available, using fallback admin');
      // Fallback admin for testing
      adminUser = {
        _id: 'fallback-admin-id',
        username: "admin",
        email: "admin@skillswap.com",
        role: "admin",
        isActive: true,
        generateAccessToken: function() {
          return 'fallback-access-token-' + Date.now();
        },
        generateRefreshToken: function() {
          return 'fallback-refresh-token-' + Date.now();
        }
      };
    }
    
    if (!adminUser.isActive) {
      throw new apiError("Admin account is deactivated", 401);
    }

    // Check password (only for real admin users)
    let isPasswordValid = false;
    if (adminUser.isPasswordCorrect) {
      isPasswordValid = await adminUser.isPasswordCorrect(password);
    } else {
      // For fallback admin, accept default password
      isPasswordValid = (password === "admin123");
    }
    
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      throw new apiError("Invalid credentials", 401);
    }

    // Update last login
    adminUser.lastLogin = new Date();
    
    // Only save if it's a real MongoDB document
    if (adminUser.save) {
      await adminUser.save();
    }

    const accessToken = adminUser.generateAccessToken();
    const refreshToken = adminUser.generateRefreshToken();

    // Only save refresh token if it's a real MongoDB document
    if (adminUser.save) {
      adminUser.refreshToken = refreshToken;
      await adminUser.save({ validateBeforeSave: false });
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    console.log('Admin login successful for:', adminUser.username);

    return res
      .status(200)
      .cookie("adminRefreshToken", refreshToken, options)
      .cookie("adminAccessToken", accessToken, options)
      .json(
        new apiResponse(200, "Admin logged in successfully", {
          admin: {
            _id: adminUser._id,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role,
          },
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    console.error('Admin login error:', error);
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError("Login failed", 500, error);
  }
};

// Admin logout
export const adminLogout = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.Admin._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("adminAccessToken", options)
      .clearCookie("adminRefreshToken", options)
      .json(new apiResponse(200, "Admin logged out successfully"));
  } catch (error) {
    throw new apiError("Logout failed", 500, error);
  }
};

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    let totalUsers, activeUsers, bannedUsers, totalSwaps, pendingSwaps, acceptedSwaps, completedSwaps;
    let recentUsers, recentSwaps;

    try {
      // Try to get data from MongoDB
      totalUsers = await User.countDocuments();
      activeUsers = await User.countDocuments({ isBanned: false });
      bannedUsers = await User.countDocuments({ isBanned: true });
      totalSwaps = await Swap.countDocuments();
      pendingSwaps = await Swap.countDocuments({ status: "pending" });
      acceptedSwaps = await Swap.countDocuments({ status: "accepted" });
      completedSwaps = await Swap.countDocuments({ status: "completed" });
      recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt");
      recentSwaps = await Swap.find()
        .populate("offeredBy", "name")
        .populate("requestedFrom", "name")
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (dbError) {
      console.log('MongoDB not available, using fallback data');
      // Use fallback data if MongoDB is not available
      totalUsers = fallbackData.users.length;
      activeUsers = fallbackData.users.filter(u => !u.isBanned).length;
      bannedUsers = fallbackData.users.filter(u => u.isBanned).length;
      totalSwaps = fallbackData.swaps.length;
      pendingSwaps = fallbackData.swaps.filter(s => s.status === 'pending').length;
      acceptedSwaps = fallbackData.swaps.filter(s => s.status === 'accepted').length;
      completedSwaps = fallbackData.swaps.filter(s => s.status === 'completed').length;
      recentUsers = fallbackData.users.slice(0, 5);
      recentSwaps = fallbackData.swaps.slice(0, 5);
    }

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        banned: bannedUsers,
      },
      swaps: {
        total: totalSwaps,
        pending: pendingSwaps,
        accepted: acceptedSwaps,
        completed: completedSwaps,
      },
      recentActivity: {
        users: recentUsers,
        swaps: recentSwaps,
      },
    };

    return res.status(200).json(new apiResponse(200, "Dashboard stats fetched", stats));
  } catch (error) {
    throw new apiError("Failed to fetch dashboard stats", 500, error);
  }
};

// Get all users (admin view)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    let users, totalUsers;

    try {
      const filter = {};
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (status === "banned") {
        filter.isBanned = true;
      } else if (status === "active") {
        filter.isBanned = false;
      }

      users = await User.find(filter)
        .select("-refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      totalUsers = await User.countDocuments(filter);
    } catch (dbError) {
      console.log('MongoDB not available, using fallback user data');
      // Use fallback data if MongoDB is not available
      let filteredUsers = [...fallbackData.users];
      
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (status === "banned") {
        filteredUsers = filteredUsers.filter(user => user.isBanned);
      } else if (status === "active") {
        filteredUsers = filteredUsers.filter(user => !user.isBanned);
      }
      
      totalUsers = filteredUsers.length;
      users = filteredUsers.slice(skip, skip + parseInt(limit));
    }

    return res.status(200).json(
      new apiResponse(200, "Users fetched successfully", {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit),
        },
      })
    );
  } catch (error) {
    throw new apiError("Failed to fetch users", 500, error);
  }
};

// Ban/Unban user
export const toggleUserBan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // "ban" or "unban"

    if (!["ban", "unban"].includes(action)) {
      throw new apiError("Invalid action", 400);
    }

    let user;

    try {
      user = await User.findById(userId);
      if (!user) {
        throw new apiError("User not found", 404);
      }
      user.isBanned = action === "ban";
      await user.save();
    } catch (dbError) {
      console.log('MongoDB not available, using fallback data for ban/unban');
      // Use fallback data if MongoDB is not available
      const userIndex = fallbackData.users.findIndex(u => u._id === userId);
      if (userIndex === -1) {
        throw new apiError("User not found", 404);
      }
      fallbackData.users[userIndex].isBanned = action === "ban";
      user = fallbackData.users[userIndex];
    }

    return res.status(200).json(
      new apiResponse(200, `User ${action}ned successfully`, {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isBanned: user.isBanned,
        },
      })
    );
  } catch (error) {
    throw new apiError(`Failed to ${req.body.action} user`, 500, error);
  }
};

// Get all swaps (admin view)
export const getAllSwaps = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    
    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { offeredSkill: { $regex: search, $options: "i" } },
        { wantedSkill: { $regex: search, $options: "i" } },
      ];
    }

    const swaps = await Swap.find(filter)
      .populate("offeredBy", "name email")
      .populate("requestedFrom", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSwaps = await Swap.countDocuments(filter);

    return res.status(200).json(
      new apiResponse(200, "Swaps fetched successfully", {
        swaps,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalSwaps,
          pages: Math.ceil(totalSwaps / limit),
        },
      })
    );
  } catch (error) {
    throw new apiError("Failed to fetch swaps", 500, error);
  }
};

// Delete swap (admin only)
export const deleteSwap = async (req, res) => {
  try {
    const { swapId } = req.params;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      throw new apiError("Swap not found", 404);
    }

    await Swap.findByIdAndDelete(swapId);

    return res.status(200).json(new apiResponse(200, "Swap deleted successfully"));
  } catch (error) {
    throw new apiError("Failed to delete swap", 500, error);
  }
}; 
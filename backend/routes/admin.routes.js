import { Router } from "express";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware.js";
import {
  adminLogin,
  adminLogout,
  getDashboardStats,
  getAllUsers,
  toggleUserBan,
  getAllSwaps,
  deleteSwap,
} from "../controllers/admin.controllers.js";

const router = Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes
router.use(adminAuthMiddleware);

router.post("/logout", adminLogout);
router.get("/dashboard/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:userId/ban", toggleUserBan);
router.get("/swaps", getAllSwaps);
router.delete("/swaps/:swapId", deleteSwap);

export default router; 
// routes/swap.routes.js

import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createSwap,
  listMySwaps,
  respondToSwap,
  cancelSwap,
} from "../controllers/swap.contollers.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create a new swap request
router.post("/", createSwap);

// List all swaps involving current user
router.get("/", listMySwaps);

// Accept or reject a pending swap
router.patch("/:id/respond", respondToSwap);

// Cancel a pending swap
router.delete("/:id", cancelSwap);

export default router;

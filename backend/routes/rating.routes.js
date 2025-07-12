import express from "express";
import {
  createRating,
  getRatingsForUser,
  getRatingBySwap,
} from "../controllers/rating.contollers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createRating);
router.get("/user/:userId",authMiddleware, getRatingsForUser);
router.get("/swap/:swapId",authMiddleware, getRatingBySwap);

export default router;

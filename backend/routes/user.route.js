import express from "express"
import { Router } from "express"
import { createUser,loginUser,getCurrentUser, updateUser ,logoutUser, updateSkills, updateAbout, updateAvailability, getUserProfile, getAllUsers} from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"

const router = Router();
router.route("/logout").post(authMiddleware, logoutUser);

router.route("/signup").post(createUser)
router.route("/signin").post(loginUser)
router.route("/getprofile").post(authMiddleware,getCurrentUser)
router.route("/updateprofile").patch(authMiddleware,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    updateUser
)

// New routes for dynamic profile management
router.route("/updateskills").patch(authMiddleware, updateSkills)
router.route("/updateabout").patch(authMiddleware, updateAbout)
router.route("/updateavailability").patch(authMiddleware, updateAvailability)
router.route("/profile").get(authMiddleware, getUserProfile)
router.route("/profile/:userId").get(authMiddleware, getUserProfile)

// Get all users for skill browsing
router.route("/users").get(authMiddleware, getAllUsers)

// Development routes (no authentication required for testing)
router.route("/dev/profile").get(getUserProfile)
router.route("/dev/updateprofile").patch(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    updateUser
)
router.route("/dev/updateskills").patch(updateSkills)
router.route("/dev/updateabout").patch(updateAbout)
router.route("/dev/updateavailability").patch(updateAvailability)
router.route("/dev/users").get(getAllUsers)

export default router
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (no authentication required)
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes (authentication required)
router.route("/logout").post(protect, logoutUser);
router.route("/me").get(protect, getMe);

export default router;

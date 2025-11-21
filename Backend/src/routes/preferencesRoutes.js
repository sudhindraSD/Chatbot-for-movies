import { Router } from "express";
import {
  getPreferences,
  updatePreferences,
} from "../controllers/preferencesController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/v1/preferences - get preferences for the authenticated user
router.get("/", protect, getPreferences);

// GET /api/v1/preferences/:userId - get preferences for a specific user (e.g. admin)
router.get("/:userId", protect, getPreferences);

// PUT /api/v1/preferences/update - update preferences for authenticated user
router.put("/update", protect, updatePreferences);

export default router;

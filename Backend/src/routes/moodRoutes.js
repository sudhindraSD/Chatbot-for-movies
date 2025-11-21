import { Router } from "express";
import { selectMood } from "../controllers/moodController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/v1/mood/select - select mood and update vibe streak
router.post("/select", protect, selectMood);

export default router;

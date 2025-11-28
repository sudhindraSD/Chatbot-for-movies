import { Router } from "express";
import {
  getRecommendations,
  pickMovie,
  getHistory,
  getTrailer,
  getUserStats,
  clearHistory,
  removeFromHistory,
  testTmdbMultiEndpoint,
} from "../controllers/movieController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/v1/movies/recommendations - get list of movies
router.get("/recommendations", protect, getRecommendations);

// POST /api/v1/movies/test-tmdb - TEST endpoint for multi-endpoint TMDB strategy
router.post("/test-tmdb", protect, testTmdbMultiEndpoint);

// POST /api/v1/movies/pick - save a picked movie
router.post("/pick", protect, pickMovie);

// GET /api/v1/movies/history/:userId - get last 5 picks for specific user
router.get("/history/:userId", protect, getHistory);

// GET /api/v1/movies/history - get last 5 picks for current user
router.get("/history", protect, getHistory);

// DELETE /api/v1/movies/history - CLEAR ALL HISTORY (⚠️ CANNOT BE UNDONE)
router.delete("/history", protect, clearHistory);

// DELETE /api/v1/movies/history/:movieId - Remove single movie
router.delete("/history/:movieId", protect, removeFromHistory);

// GET /api/v1/movies/trailer/:movieId - get trailer URL
router.get("/trailer/:movieId", protect, getTrailer);

// GET /api/v1/movies/stats/:userId - get stats for specific user
router.get("/stats/:userId", protect, getUserStats);

// GET /api/v1/movies/stats - get stats for current user
router.get("/stats", protect, getUserStats);

export default router;

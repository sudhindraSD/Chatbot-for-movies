/**
 * Constants used throughout the app
 */

// API Configuration
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
export const APP_NAME = "FlickPick";

// Available mood options
export const MOODS = [
  "energetic",
  "chill",
  "emotional",
  "thrilling",
  "fun",
  "deep",
  "romantic",
  "dark",
  "surprise",
];

// Movie genres
export const GENRES = [
  "action",
  "comedy",
  "horror",
  "drama",
  "thriller",
  "romance",
  "sci-fi",
  "animation",
];

// Movie length options
export const MOVIE_LENGTHS = {
  SHORT: "short",
  LONG: "long",
  ANY: "any",
};

// Age rating options
export const AGE_RATINGS = {
  PG: "pg",
  TEEN: "teen",
  MATURE: "mature",
  ANY: "any",
};

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  MOOD: "/mood",
  CHAT: "/chat",
  MOVIES: "/movies",
  HISTORY: "/history",
  PROFILE: "/profile",
};

// Animation durations (in ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  SLOT_SPIN: 50, // Slot machine spin speed
  SLOT_SLOWDOWN: 1.5, // Multiplier for slowing down
};

// Local storage keys
export const STORAGE_KEYS = {
  SESSION_ID: "flickpick_session_id",
  LAST_MOOD: "flickpick_last_mood",
};

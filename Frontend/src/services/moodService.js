import api from "./api";

/**
 * Mood Service
 * Handles mood selection and streak tracking
 */

/**
 * Select a mood and update the user's mood streak
 * @param {string} mood - The selected mood (e.g., "energetic", "chill")
 * @returns {Promise<Object>} Response with mood, streak count, and streak message
 */
export const selectMood = async (mood) => {
  try {
    const response = await api.post("/mood/select", { mood });
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to select mood");
  }
};

/**
 * Get a mood suggestion based on current time of day
 * This is client-side logic, not an API call
 * @returns {string} Suggested mood
 */
export const getMoodSuggestion = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    // Morning (5am - 12pm)
    const morningMoods = ["energetic", "uplifting", "fun"];
    return morningMoods[Math.floor(Math.random() * morningMoods.length)];
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12pm - 5pm)
    const afternoonMoods = ["chill", "fun", "light"];
    return afternoonMoods[Math.floor(Math.random() * afternoonMoods.length)];
  } else if (hour >= 17 && hour < 21) {
    // Evening (5pm - 9pm)
    const eveningMoods = ["thrilling", "deep", "romantic"];
    return eveningMoods[Math.floor(Math.random() * eveningMoods.length)];
  } else {
    // Night (9pm - 5am)
    const nightMoods = ["emotional", "intense", "dark"];
    return nightMoods[Math.floor(Math.random() * nightMoods.length)];
  }
};

/**
 * Get all available moods with their emoji and description
 * @returns {Array<Object>} Array of mood objects
 */
export const getAllMoods = () => [
  {
    id: "energetic",
    emoji: "⚡",
    name: "Energetic",
    tagline: "Fast-paced action vibes",
    color: "from-orange-500 to-red-600",
  },
  {
    id: "chill",
    emoji: "😌",
    name: "Chill",
    tagline: "Relaxed and easy-going",
    color: "from-blue-400 to-purple-500",
  },
  {
    id: "emotional",
    emoji: "💔",
    name: "Emotional",
    tagline: "Deep feels and drama",
    color: "from-pink-400 to-purple-600",
  },
  {
    id: "thrilling",
    emoji: "🎢",
    name: "Thrilling",
    tagline: "Edge-of-your-seat suspense",
    color: "from-red-500 to-purple-700",
  },
  {
    id: "fun",
    emoji: "🎉",
    name: "Fun",
    tagline: "Laughs and good vibes",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "deep",
    emoji: "🧠",
    name: "Deep",
    tagline: "Thought-provoking cinema",
    color: "from-indigo-500 to-blue-700",
  },
  {
    id: "romantic",
    emoji: "💕",
    name: "Romantic",
    tagline: "Love and butterflies",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "dark",
    emoji: "🌑",
    name: "Dark",
    tagline: "Twisted and intense",
    color: "from-gray-700 to-black",
  },
  {
    id: "surprise",
    emoji: "🎲",
    name: "Surprise Me",
    tagline: "Feeling adventurous?",
    color: "from-purple-500 via-pink-500 to-yellow-500",
  },
];

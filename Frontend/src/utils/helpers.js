/**
 * Helper utility functions
 */

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return `${Math.floor(seconds / 2592000)} months ago`;
};

/**
 * Format date to readable string (e.g., "Jan 15, 2024")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Generate random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Get rating stars (filled/empty) for a movie rating
 * @param {number} rating - Rating out of 10
 * @returns {Object} { filled, empty } star counts
 */
export const getRatingStars = (rating) => {
  const filled = Math.round((rating / 10) * 5);
  const empty = 5 - filled;
  return { filled, empty };
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if string is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get mood emoji by mood name
 * @param {string} mood - Mood name
 * @returns {string} Emoji
 */
export const getMoodEmoji = (mood) => {
  const emojiMap = {
    energetic: "⚡",
    chill: "😌",
    emotional: "💔",
    thrilling: "🎢",
    fun: "🎉",
    deep: "🧠",
    romantic: "💕",
    dark: "🌑",
    surprise: "🎲",
  };
  return emojiMap[mood.toLowerCase()] || "🎬";
};

/**
 * Get color gradient class for mood
 * @param {string} mood - Mood name
 * @returns {string} Tailwind gradient class
 */
export const getMoodColor = (mood) => {
  const colorMap = {
    energetic: "from-orange-500 to-red-600",
    chill: "from-blue-400 to-purple-500",
    emotional: "from-pink-400 to-purple-600",
    thrilling: "from-red-500 to-purple-700",
    fun: "from-yellow-400 to-orange-500",
    deep: "from-indigo-500 to-blue-700",
    romantic: "from-pink-500 to-rose-600",
    dark: "from-gray-700 to-black",
    surprise: "from-purple-500 via-pink-500 to-yellow-500",
  };
  return colorMap[mood.toLowerCase()] || "from-gray-500 to-gray-700";
};

/**
 * Sleep function (useful for delays)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

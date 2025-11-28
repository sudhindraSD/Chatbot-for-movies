import api from "./api";

/**
 * Movie Service
 * Handles all movie-related API calls
 */

/**
 * Get movie recommendations based on filters
 * @param {Object} filters - Optional filter parameters
 * @param {string} filters.genre - Genre preference
 * @param {string} filters.length - Movie length preference (short/long/any)
 * @param {string} filters.rating - Age rating preference (pg/teen/mature/any)
 * @param {number} filters.page - Page number for pagination
 * @returns {Promise<Object>} Response with movies array
 */
export const getRecommendations = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.length) params.append("length", filters.length);
    if (filters.rating) params.append("rating", filters.rating);
    if (filters.page) params.append("page", filters.page);
    if (filters.mood) params.append("mood", filters.mood); // Pass mood to backend

    const response = await api.get(
      `/movies/recommendations?${params.toString()}`
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to get recommendations");
  }
};

/**
 * Save a picked movie to user's history
 * @param {Object} movieData - Movie data to save
 * @param {number} movieData.movieId - TMDB movie ID
 * @param {string} movieData.movieTitle - Movie title
 * @param {string} movieData.moviePoster - Poster URL
 * @param {string} movieData.genre - Genre
 * @param {string} movieData.mood - User's current mood
 * @returns {Promise<Object>} Response with success message and hot take
 */
export const pickMovie = async (movieData) => {
  try {
    const response = await api.post("/movies/pick", movieData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to save movie");
  }
};

/**
 * Get user's movie history (last 5 picks)
 * @param {string} userId - Optional user ID (uses current user if not provided)
 * @returns {Promise<Object>} Response with history array
 */
export const getHistory = async (userId = null) => {
  try {
    const endpoint = userId ? `/movies/history/${userId}` : "/movies/history";
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to get history");
  }
};

/**
 * Get YouTube trailer URL for a movie
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Response with trailerUrl
 */
export const getTrailer = async (movieId) => {
  try {
    const response = await api.get(`/movies/trailer/${movieId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to get trailer");
  }
};

/**
 * Get user statistics
 * @param {string} userId - Optional user ID (uses current user if not provided)
 * @returns {Promise<Object>} Response with stats object
 */
export const getUserStats = async (userId = null) => {
  try {
    const endpoint = userId ? `/movies/stats/${userId}` : "/movies/stats";
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to get stats");
  }
};

/**
 * Get user preferences
 * @param {string} userId - Optional user ID (uses current user if not provided)
 * @returns {Promise<Object>} Response with preferences object
 */
export const getPreferences = async (userId = null) => {
  try {
    const endpoint = userId ? `/preferences/${userId}` : "/preferences";
    const response = await api.get(endpoint);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to get preferences");
  }
};

/**
 * Update user preferences
 * @param {Object} updates - Preference updates
 * @returns {Promise<Object>} Response with updated preferences
 */
export const updatePreferences = async (updates) => {
  try {
    const response = await api.put("/preferences/update", updates);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to update preferences");
  }
};

/**
 * Clear user's entire movie history
 * ⚠️ THIS IS PERMANENT AND CANNOT BE UNDONE!
 * @returns {Promise<Object>} Response with success message
 */
export const clearHistory = async () => {
  try {
    const response = await api.delete("/movies/history");
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to clear history");
  }
};

/**
 * Remove a single movie from history
 * @param {string} movieId - ID of the history entry to remove
 * @returns {Promise<Object>} Response with success message
 */
export const removeFromHistory = async (movieId) => {
  try {
    const response = await api.delete(`/movies/history/${movieId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to remove movie");
  }
};

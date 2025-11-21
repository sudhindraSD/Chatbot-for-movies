import { createContext, useContext, useState, useEffect } from "react";
import * as movieService from "../services/movieService";

/**
 * AppContext - Manages app-wide state (mood, conversation, movies, stats)
 * This is separate from auth to keep concerns separated
 */

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Mood state - ENHANCED for multiple moods
  const [selectedMood, setSelectedMood] = useState(null); // Primary mood
  const [selectedMoods, setSelectedMoods] = useState([]); // Array of all selected moods
  const [moodStreak, setMoodStreak] = useState(0);

  // Chat state
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Movie state
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);

  // User stats
  const [userStats, setUserStats] = useState(null);

  /**
   * Set the current mood(s)
   * @param {string} mood - Primary selected mood
   * @param {number} streak - Mood streak count
   * @param {Array} allMoods - Array of all selected mood IDs
   */
  const setMood = (mood, streak = 0, allMoods = []) => {
    setSelectedMood(mood);
    setMoodStreak(streak);
    setSelectedMoods(allMoods.length > 0 ? allMoods : [mood]);
  };

  /**
   * Add a message to conversation history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   */
  const addMessage = (role, content) => {
    setConversationHistory((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  /**
   * Clear conversation history
   * Usually called when starting a new chat session
   */
  const clearConversation = () => {
    setConversationHistory([]);
    setCurrentSessionId(null);
  };

  /**
   * Set the current session ID
   * @param {string} sessionId - Unique session ID
   */
  const setSessionId = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  /**
   * Set the list of recommended movies
   * @param {Array} movies - Array of movie objects
   */
  const setMovies = (movies) => {
    setSelectedMovies(movies);
  };

  /**
   * Select a specific movie
   * @param {Object} movie - Movie object
   */
  const selectMovie = (movie) => {
    setCurrentMovie(movie);
  };

  /**
   * Fetch and update user statistics
   */
  const updateStats = async () => {
    try {
      const response = await movieService.getUserStats();
      if (response.success) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  /**
   * Reset all app state
   * Useful when logging out or starting fresh
   */
  const resetAppState = () => {
    setSelectedMood(null);
    setMoodStreak(0);
    setConversationHistory([]);
    setCurrentSessionId(null);
    setSelectedMovies([]);
    setCurrentMovie(null);
    setUserStats(null);
  };

  const value = {
    // Mood
    selectedMood,
    selectedMoods, // NEW: Array of all selected moods
    moodStreak,
    setMood,

    // Chat
    conversationHistory,
    currentSessionId,
    addMessage,
    clearConversation,
    setSessionId,

    // Movies
    selectedMovies,
    currentMovie,
    setMovies,
    selectMovie,

    // Stats
    userStats,
    updateStats,

    // Reset
    resetAppState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use app context
 * Usage: const { selectedMood, setMood, addMessage } = useApp();
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default AppContext;

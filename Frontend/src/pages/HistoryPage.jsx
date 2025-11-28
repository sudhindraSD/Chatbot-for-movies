import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Calendar, Heart, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import Navigation from "../components/layout/Navigation";
import * as movieService from "../services/movieService";
import { formatRelativeTime } from "../utils/helpers";
import toast from "react-hot-toast";

/**
 * HistoryPage - Shows last 5 picked movies WITH PERSONALITY 🎬
 */

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await movieService.getHistory();
      setHistory(response.history || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast.error("Couldn't load history. The projector broke! 📽️");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear entire history - WITH CONFIRMATION
   * This is PERMANENT and cannot be undone!
   */
  const handleClearHistory = async () => {
    // DOUBLE CONFIRMATION - this is serious!
    const confirmed = window.confirm(
      "⚠️ CLEAR YOUR ENTIRE MOVIE HISTORY?\n\n" +
      "This will permanently delete ALL your picked movies.\n" +
      "This action CANNOT be undone!\n\n" +
      "Are you absolutely sure?"
    );

    if (!confirmed) return;

    setClearing(true);

    try {
      await movieService.clearHistory();
      setHistory([]);
      toast.success("History cleared! Fresh start 🎬✨", {
        icon: "🗑️",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Oops! Couldn't clear history. Try again.");
    } finally {
      setClearing(false);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!window.confirm("Remove this movie from your history?")) return;

    try {
      await movieService.removeFromHistory(movieId);
      setHistory((prev) => prev.filter((m) => m._id !== movieId));
      toast.success("Movie removed from history");
    } catch (error) {
      console.error("Failed to remove movie:", error);
      toast.error("Failed to remove movie");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <p className="text-gray-400">Loading your picks...</p>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Clear Button */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Your Movie History
            </motion.h1>

            {/* Clear History Button - Only show if there's history */}
            <AnimatePresence>
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    onClick={handleClearHistory}
                    disabled={clearing}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-red-500/50 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                    {clearing ? "Clearing..." : "Clear All"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Film className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-400 text-xl mb-2">
                Your cinema journey starts here 🎬
              </p>
              <p className="text-gray-500 mt-2">
                Pick some movies to see them here!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {history.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 flex gap-6"
                >
                  {movie.moviePoster && (
                    <img
                      src={movie.moviePoster}
                      alt={movie.movieTitle}
                      className="w-24 h-36 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {movie.movieTitle}
                      </h3>
                      <button
                        onClick={() => handleRemoveMovie(movie._id)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        title="Remove from history"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatRelativeTime(movie.pickedAt)}
                      </span>
                      {movie.genre && (
                        <span className="px-3 py-1 bg-purple-500/20 rounded-full">
                          {movie.genre}
                        </span>
                      )}
                      {movie.mood && (
                        <span className="px-3 py-1 bg-pink-500/20 rounded-full">
                          {movie.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;

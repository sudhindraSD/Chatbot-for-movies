import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StopCircle,
  Sparkles,
  Film,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";

/**
 * MovieCarousel - INFINITE SCROLLING MOVIE SHOWCASE
 *
 * Full-screen movie carousel that infinitely scrolls through movies
 * with smooth animations, large posters, and stop-on-click selection
 */

const MovieCarousel = ({ movies = [], onMoviePicked }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(1500); // ms per movie - SLOWER for smoother feel
  const intervalRef = useRef(null);
  const [extendedMovies, setExtendedMovies] = useState([]);

  // Triple the movies array for smooth infinite loop
  useEffect(() => {
    if (movies.length > 0) {
      const tripled = [...movies, ...movies, ...movies];
      setExtendedMovies(tripled);
      // Auto-start scrolling
      setTimeout(() => startScrolling(), 500);
    }
  }, [movies]);

  /**
   * Start infinite scrolling
   */
  const startScrolling = () => {
    setIsScrolling(true);
    setSelectedMovie(null);
    setCurrentIndex(0);
  };

  /**
   * Infinite scrolling loop
   */
  useEffect(() => {
    if (isScrolling && !selectedMovie) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % extendedMovies.length);
      }, scrollSpeed);

      return () => clearInterval(intervalRef.current);
    }
  }, [isScrolling, selectedMovie, scrollSpeed, extendedMovies.length]);

  /**
   * Stop and select movie
   */
  const handleStop = () => {
    if (!isScrolling) return;

    clearInterval(intervalRef.current);
    setIsScrolling(false);

    // Get the actual movie (accounting for tripled array)
    const actualIndex = currentIndex % movies.length;
    const picked = movies[actualIndex];
    setSelectedMovie(picked);
  };

  /**
   * Manual navigation
   */
  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + extendedMovies.length) % extendedMovies.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % extendedMovies.length);
  };

  /**
   * Get visible movies for carousel (show 3: previous, current, next)
   */
  const getVisibleMovies = () => {
    if (extendedMovies.length === 0) return [];

    const prevIndex =
      (currentIndex - 1 + extendedMovies.length) % extendedMovies.length;
    const nextIndex = (currentIndex + 1) % extendedMovies.length;

    return [
      { movie: extendedMovies[prevIndex], position: "left" },
      { movie: extendedMovies[currentIndex], position: "center" },
      { movie: extendedMovies[nextIndex], position: "right" },
    ];
  };

  const visibleMovies = getVisibleMovies();

  if (extendedMovies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden">
      {/* ANIMATED BACKGROUND */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* FLOATING FILM PARTICLES - REMOVED for cleaner look */}

      <div className="relative z-10 w-full max-w-7xl px-4">
        {!selectedMovie ? (
          <>
            {/* MOVIE CAROUSEL */}
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                disabled={isScrolling}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={goToNext}
                disabled={isScrolling}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>

              {/* Movie Cards */}
              <div className="flex items-center justify-center gap-8 py-8">
                {visibleMovies.map(({ movie, position }, idx) => {
                  const isCenter = position === "center";
                  const scale = isCenter ? 1 : 0.7;
                  const opacity = isCenter ? 1 : 0.4;
                  const zIndex = isCenter ? 30 : 10;

                  return (
                    <motion.div
                      key={`${movie.id}-${idx}-${currentIndex}`}
                      className="relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale,
                        opacity,
                        x:
                          position === "left"
                            ? -100
                            : position === "right"
                              ? 100
                              : 0,
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ zIndex }}
                    >
                      <div
                        className={`relative bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-2 ${isCenter ? "border-purple-500" : "border-gray-700"
                          }`}
                        style={{
                          width: isCenter ? "400px" : "280px",
                          height: isCenter ? "650px" : "450px",
                        }}
                      >
                        {/* Movie Poster */}
                        {movie.poster && (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Overlay with details (center only) */}
                        {isCenter && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-6">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <h3 className="text-3xl font-bold text-white mb-2 line-clamp-2">
                                {movie.title}
                              </h3>
                              <div className="flex items-center gap-4 mb-3">
                                <span className="text-yellow-400 text-lg font-bold">
                                  ⭐ {movie.rating?.toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {movie.releaseYear}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                                {movie.overview}
                              </p>
                            </motion.div>
                          </div>
                        )}

                        {/* Pulsing border for center card */}
                        {isCenter && isScrolling && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-4 border-pink-500"
                            animate={{
                              boxShadow: [
                                "0 0 20px rgba(236, 72, 153, 0.4)",
                                "0 0 40px rgba(236, 72, 153, 0.8)",
                                "0 0 20px rgba(236, 72, 153, 0.4)",
                              ],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* STOP BUTTON */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <motion.div
                animate={
                  isScrolling
                    ? {
                      scale: [1, 1.05, 1],
                    }
                    : {}
                }
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Button
                  onClick={handleStop}
                  disabled={!isScrolling}
                  className="relative px-16 py-8 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white text-2xl font-bold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                >
                  {/* Shimmer effect */}
                  {isScrolling && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: [-200, 200],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  <motion.div
                    animate={
                      isScrolling
                        ? {
                          boxShadow: [
                            "0 0 20px rgba(239, 68, 68, 0.5)",
                            "0 0 40px rgba(239, 68, 68, 0.8)",
                            "0 0 20px rgba(239, 68, 68, 0.5)",
                          ],
                        }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-3 relative z-10"
                  >
                    <StopCircle className="w-8 h-8" />
                    PICK THIS MOVIE!
                  </motion.div>
                </Button>
              </motion.div>

              <p className="text-gray-400 text-center">
                {isScrolling
                  ? "Click STOP to select the movie in the center! 🎯"
                  : "Use arrows to browse, or start scrolling again"}
              </p>
            </div>
          </>
        ) : (
          /* SELECTED MOVIE - FULL SHOWCASE */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center"
          >
            {/* Sparkle celebration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <Sparkles className="w-16 h-16 text-yellow-400" />
            </motion.div>

            {/* Movie Details Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 max-w-2xl mx-auto border-2 border-purple-500 shadow-2xl"
            >
              {selectedMovie.poster && (
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-64 h-96 object-cover rounded-xl mx-auto mb-6 shadow-2xl"
                />
              )}

              <h2 className="text-5xl font-bold text-white mb-4">
                {selectedMovie.title}
              </h2>

              <div className="flex items-center justify-center gap-6 mb-6">
                <span className="text-yellow-400 text-2xl font-bold">
                  ⭐ {selectedMovie.rating?.toFixed(1)}/10
                </span>
                <span className="text-gray-400 text-lg">
                  {selectedMovie.releaseYear}
                </span>
              </div>

              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                {selectedMovie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => onMoviePicked(selectedMovie)}
                  className="px-10 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl rounded-xl shadow-lg"
                >
                  LOCK IT IN! 🎬
                </Button>
                <Button
                  onClick={startScrolling}
                  variant="outline"
                  className="px-10 py-6 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 font-bold text-xl rounded-xl"
                >
                  BROWSE MORE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;

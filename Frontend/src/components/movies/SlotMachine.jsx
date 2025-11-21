import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { StopCircle, Repeat, Sparkles, Film, Zap, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { shuffleArray, sleep } from "../../utils/helpers";

/**
 * SlotMachine - THE SIGNATURE FEATURE 🎰
 * ARJUNA-LEVEL PRECISION ANIMATION
 *
 * A BUTTERY-SMOOTH slot machine that spins through movies
 * with gradual slowdown, glowing effects, and dramatic flair.
 *
 * Animation stages:
 * 1. SPINNING - Fast infinite scroll (30ms per frame)
 * 2. STOPPING - GRADUAL slowdown with cinematic easing
 * 3. LANDED - Final movie revealed with EXPLOSIVE effects
 */

const SlotMachine = ({ movies = [], onMoviePicked }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [landedMovie, setLandedMovie] = useState(null);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(30); // ms per frame - FASTER for smoothness
  const intervalRef = useRef(null);
  const controls = useAnimation();

  // Prepare movies for slot machine (QUADRUPLE for extra smooth looping)
  useEffect(() => {
    if (movies.length > 0) {
      // QUADRUPLE the movies array for ultra-smooth looping
      const loopedMovies = [...movies, ...movies, ...movies, ...movies];
      setVisibleMovies(loopedMovies);
      // Auto-start spinning with entrance animation
      controls.start({ scale: [0.8, 1], opacity: [0, 1] });
      setTimeout(() => startSpinning(), 800);
    }
  }, [movies]);

  /**
   * START SPINNING - Begin FAST infinite scroll
   */
  const startSpinning = () => {
    setIsSpinning(true);
    setIsStopping(false);
    setLandedMovie(null);
    setSpeed(30); // FAST initial speed for excitement
    setCurrentIndex(0);
  };

  /**
   * Spinning animation loop
   * SMOOTH continuous scrolling with requestAnimationFrame-like precision
   */
  useEffect(() => {
    if (isSpinning && !isStopping) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % visibleMovies.length);
      }, speed);

      return () => clearInterval(intervalRef.current);
    }
  }, [isSpinning, isStopping, speed, visibleMovies.length]);

  /**
   * STOP BUTTON HANDLER - Initiates GRADUAL slowdown sequence
   */
  const handleStop = async () => {
    if (!isSpinning || isStopping) return;

    setIsStopping(true);
    clearInterval(intervalRef.current);

    // GRADUAL slowdown sequence - MORE STEPS for smoother deceleration
    await slowDownAndLand();
  };

  /**
   * SLOWDOWN AND LAND - The MAGIC happens here 🎬✨
   * BUTTERY SMOOTH deceleration with cinematic timing
   */
  const slowDownAndLand = async () => {
    // EXPANDED slowdown sequence for MAXIMUM smoothness
    const slowdownSteps = [
      50, // Still fast
      70, // Starting to slow
      95, // Getting slower
      130, // Noticeable deceleration
      180, // Slowing down more
      250, // Much slower
      350, // Really slow now
      500, // Very slow
      700, // Almost there...
      1000, // Final dramatic pause
    ];

    for (const stepSpeed of slowdownSteps) {
      await sleep(stepSpeed);
      setCurrentIndex((prev) => (prev + 1) % visibleMovies.length);
    }

    // FINAL LAND with suspense
    await sleep(1200);
    setCurrentIndex((prev) => {
      const finalIndex = (prev + 1) % visibleMovies.length;
      // Pick the actual movie (accounting for quadrupled array)
      const actualIndex = finalIndex % movies.length;
      const finalMovie = movies[actualIndex];
      setLandedMovie(finalMovie);
      setIsSpinning(false);

      // Trigger explosion animation
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
      });

      return finalIndex;
    });
  };

  /**
   * SPIN AGAIN - Reset with PERSONALITY
   */
  const spinAgain = () => {
    setLandedMovie(null);
    // Shuffle movies for variety
    const shuffled = shuffleArray(movies);
    const looped = [...shuffled, ...shuffled, ...shuffled, ...shuffled];
    setVisibleMovies(looped);

    // Smooth transition
    controls.start({ scale: [1, 0.95, 1] });
    setTimeout(() => startSpinning(), 400);
  };

  // Get the 5 movies to display in viewport (MORE VISIBLE for smoothness)
  const getVisibleSlots = () => {
    if (visibleMovies.length === 0) return [];
    const slots = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % visibleMovies.length;
      slots.push(visibleMovies[index]);
    }
    return slots;
  };

  const slots = getVisibleSlots();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden">
      {/* ANIMATED BACKGROUND GLOW - Multi-layered for depth */}
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
          style={{ transform: "translate(-50%, -50%)" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [0.9, 1.3, 0.9],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* PARTICLE EFFECTS - Floating film strips */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Film className="w-4 h-4 text-purple-400/40" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Slot Machine Frame */}
        <div className="relative">
          {/* Neon border effect */}
          <motion.div
            className="absolute inset-0 border-4 border-pink-500/50 rounded-3xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(236, 72, 153, 0.5)",
                "0 0 40px rgba(236, 72, 153, 0.8)",
                "0 0 20px rgba(236, 72, 153, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Slot Machine Window - ENHANCED */}
          <motion.div
            animate={controls}
            className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/30"
          >
            {!landedMovie ? (
              <>
                {/* Spinning Slots - TALLER viewport for more movies */}
                <div className="h-[600px] overflow-hidden relative">
                  {/* Top fade overlay - STRONGER gradient */}
                  <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />

                  {/* CENTER SPOTLIGHT - Highlights the selected slot */}
                  <div className="absolute top-1/2 left-0 right-0 h-32 -mt-16 z-5 pointer-events-none">
                    <motion.div
                      className="absolute inset-0 border-2 border-yellow-400/50 rounded-xl"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(250, 204, 21, 0.3)",
                          "0 0 40px rgba(250, 204, 21, 0.6)",
                          "0 0 20px rgba(250, 204, 21, 0.3)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  {/* Movie slots - ENHANCED with better scaling */}
                  <div className="space-y-3">
                    {slots.map((movie, index) => {
                      // Center slot (index 2) is the "selected" position
                      const isCenter = index === 2;
                      const distanceFromCenter = Math.abs(index - 2);
                      const scale = isCenter
                        ? 1.1
                        : 1 - distanceFromCenter * 0.1;
                      const opacity = isCenter
                        ? 1
                        : 0.4 - distanceFromCenter * 0.1;
                      const blur = isCenter ? 0 : distanceFromCenter * 2;

                      return (
                        <motion.div
                          key={`${movie?.id}-${index}-${currentIndex}`}
                          className={`flex items-center gap-6 p-6 rounded-xl transition-all duration-200 ${
                            isCenter
                              ? "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-2 border-purple-400/50 shadow-xl"
                              : "bg-gray-900/30"
                          }`}
                          style={{
                            transform: `scale(${scale})`,
                            opacity: opacity,
                            filter: `blur(${blur}px)`,
                          }}
                          animate={
                            isCenter && isSpinning && !isStopping
                              ? {
                                  boxShadow: [
                                    "0 0 20px rgba(168, 85, 247, 0.4)",
                                    "0 0 40px rgba(168, 85, 247, 0.6)",
                                    "0 0 20px rgba(168, 85, 247, 0.4)",
                                  ],
                                }
                              : {}
                          }
                        >
                          {movie?.poster && (
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-24 h-36 object-cover rounded-lg shadow-lg shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-bold text-white mb-2 leading-tight ${
                                isCenter ? "text-2xl" : "text-lg"
                              } line-clamp-2`}
                              title={movie?.title}
                            >
                              {movie?.title || "Loading..."}
                            </h3>
                            {isCenter && (
                              <p className="text-gray-400 text-sm line-clamp-3">
                                {movie?.overview || ""}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Bottom fade overlay - STRONGER gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
                </div>

                {/* STOP Button - ENHANCED with pulsing */}
                <div className="mt-8 flex justify-center">
                  <motion.div
                    animate={
                      isSpinning && !isStopping
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <Button
                      onClick={handleStop}
                      disabled={!isSpinning || isStopping}
                      className="relative px-12 py-8 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white text-2xl font-bold rounded-full shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      {isSpinning && !isStopping && (
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
                          isSpinning && !isStopping
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
                        {isStopping ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            STOPPING...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6" />
                            STOP!
                          </>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              /* LANDED - Movie Selected WITH EXPLOSION EFFECTS! */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-center relative"
              >
                {/* Sparkle effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mb-6"
                >
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>

                {/* Movie poster */}
                {landedMovie.poster && (
                  <motion.img
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={landedMovie.poster}
                    alt={landedMovie.title}
                    className="w-48 h-72 object-cover rounded-xl mx-auto mb-6 shadow-2xl"
                  />
                )}

                {/* Movie info */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-white mb-4"
                >
                  {landedMovie.title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-2"
                >
                  ⭐ {landedMovie.rating?.toFixed(1)}/10
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-400 text-sm mb-8 max-w-xl mx-auto"
                >
                  {landedMovie.overview}
                </motion.p>

                {/* Action buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4 justify-center"
                >
                  <Button
                    onClick={() => onMoviePicked(landedMovie)}
                    className="px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg"
                  >
                    PICK THIS! 🎬
                  </Button>
                  <Button
                    onClick={spinAgain}
                    variant="outline"
                    className="px-8 py-6 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 font-bold text-lg rounded-xl"
                  >
                    <Repeat className="w-5 h-5 mr-2" />
                    SPIN AGAIN
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        {!landedMovie && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-6"
          >
            {isSpinning && !isStopping
              ? "Hit STOP when you feel lucky! 🎰"
              : isStopping
              ? "Landing on your perfect pick..."
              : "Get ready..."}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;

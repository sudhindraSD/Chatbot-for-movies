import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MovieSpinner = ({ movies = [], onComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // If movies change, reset
    useEffect(() => {
        if (movies.length > 0) {
            setSpinning(false);
            setSelectedMovie(null);
        }
    }, [movies]);

    const handleSpin = () => {
        if (movies.length === 0 || spinning) return;

        setSpinning(true);

        // Pick a random movie
        const randomIndex = Math.floor(Math.random() * movies.length);
        const movie = movies[randomIndex];

        // We want to land on the movie in the 3rd repetition of the list for a good spin duration
        // The list is rendered as [...movies, ...movies, ...movies, ...movies, ...movies] (5x)
        // We target the middle set (index 2)
        const targetIndex = (movies.length * 2) + randomIndex;

        setSelectedMovie({ ...movie, targetIndex });
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* SLOT MACHINE CONTAINER */}
            <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden border-4 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">

                {/* Overlay Gradients for 3D effect */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                {/* Selection Highlight (Center) */}
                <div className="absolute top-1/2 left-0 right-0 h-24 -mt-12 bg-white/5 border-y-2 border-yellow-400/50 z-0 pointer-events-none backdrop-blur-[2px]" />

                {/* SPINNER STRIP */}
                <motion.div
                    className="flex flex-col"
                    initial={{ y: 0 }}
                    animate={spinning && selectedMovie ? {
                        y: -(selectedMovie.targetIndex * 96) // 96px is item height (h-24)
                    } : { y: 0 }}
                    transition={spinning ? {
                        duration: 4,
                        ease: [0.1, 0.9, 0.2, 1.0], // Custom bezier for "slot machine" feel (fast start, slow stop)
                    } : { duration: 0 }}
                    onAnimationComplete={() => {
                        if (spinning) {
                            setSpinning(false);
                            if (onComplete) onComplete(selectedMovie);
                        }
                    }}
                >
                    {/* Render 5 copies of the list for seamless spinning */}
                    {[...movies, ...movies, ...movies, ...movies, ...movies].map((movie, idx) => (
                        <div
                            key={`${movie.id}-${idx}`}
                            className="h-24 flex items-center justify-center px-4 border-b border-white/5"
                        >
                            <div className="flex items-center gap-4 w-full max-w-xs">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-12 h-16 object-cover rounded shadow-sm"
                                    />
                                ) : (
                                    <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                                        No Img
                                    </div>
                                )}
                                <span className="text-white font-bold text-lg truncate text-shadow">
                                    {movie.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* SPIN BUTTON */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpin}
                disabled={spinning || movies.length === 0}
                className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {spinning ? "SPINNING..." : "SPIN THE WHEEL! 🎰"}
            </motion.button>
        </div>
    );
};

export default MovieSpinner;

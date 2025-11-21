import { motion } from "framer-motion";

const CinematicLoader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring - Spinning Opposite */}
                <motion.div
                    className="absolute inset-2 border-4 border-t-pink-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Pulse */}
                <motion.div
                    className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

            <motion.p
                className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {text}
            </motion.p>
        </div>
    );
};

export default CinematicLoader;

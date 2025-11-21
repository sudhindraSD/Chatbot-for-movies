import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import * as moodService from "../../services/moodService";
import toast from "react-hot-toast";

/**
 * MoodSelector - ENHANCED Multi-Selection
 * User can pick MULTIPLE moods/genres to get hyper-personalized recommendations
 */

const MoodSelector = () => {
  const navigate = useNavigate();
  const { setMood } = useApp();
  const moods = moodService.getAllMoods();

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle mood selection
  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) => {
      const isSelected = prev.find((m) => m.id === mood.id);
      if (isSelected) {
        // Remove if already selected
        return prev.filter((m) => m.id !== mood.id);
      } else {
        // Add if not selected (max 5)
        if (prev.length >= 5) {
          toast.error("Maximum 5 moods allowed! Remove one to add another.", {
            icon: "⚠️",
          });
          return prev;
        }
        return [...prev, mood];
      }
    });
  };

  // Submit selected moods
  const handleSubmit = async () => {
    if (selectedMoods.length === 0) {
      toast.error("Pick at least one mood to continue! 🎬");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send all selected moods to backend
      // For now, we'll send the first one as primary mood
      const primaryMood = selectedMoods[0].id;
      const response = await moodService.selectMood(primaryMood);

      // Store all selected moods in context
      setMood(
        primaryMood,
        response.streakCount,
        selectedMoods.map((m) => m.id)
      );

      // Show success message
      if (response.streakMessage) {
        toast.success(response.streakMessage, { icon: "🔥", duration: 2000 });
      } else {
        toast.success(
          `Perfect! ${selectedMoods.length} mood${
            selectedMoods.length > 1 ? "s" : ""
          } locked in! 🎬`,
          { duration: 2000 }
        );
      }

      // Navigate to chat after short delay WITH MOOD DATA
      setTimeout(() => {
        navigate("/chat", {
          state: { mood: primaryMood },
        });
      }, 1500);
    } catch (error) {
      console.error("Failed to select mood:", error);
      toast.error("Oops! Couldn't save your moods. Try again!");
      setIsSubmitting(false);
    }
  };

  const isSelected = (moodId) => selectedMoods.find((m) => m.id === moodId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            What's your vibe?
          </h1>
          <p className="text-gray-300 text-xl mb-2">
            Select multiple moods to personalize your experience
          </p>
          <p className="text-purple-400 text-sm font-medium">
            ✨ Pick 1-5 moods that match your current energy ✨
          </p>
        </motion.div>

        {/* Selection Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-purple-500/20 backdrop-blur-xl border-2 border-purple-500/50 rounded-full px-6 py-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white font-bold text-lg">
              {selectedMoods.length} / 5 Selected
            </span>
          </div>
        </motion.div>

        {/* Mood Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {moods.map((mood, index) => {
            const selected = isSelected(mood.id);
            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodToggle(mood)}
                className={`relative cursor-pointer p-8 rounded-2xl bg-gradient-to-br ${
                  mood.color
                } 
                  border-4 transition-all duration-300 shadow-2xl hover:shadow-3xl group
                  ${
                    selected
                      ? "border-white scale-105 ring-4 ring-white/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check
                        className="w-6 h-6 text-purple-600"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Emoji */}
                <motion.div
                  className="text-7xl mb-4 transform transition-transform"
                  animate={selected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {mood.emoji}
                </motion.div>

                {/* Name */}
                <h3 className="text-3xl font-bold text-white mb-2">
                  {mood.name}
                </h3>

                {/* Tagline */}
                <p className="text-white/90 text-sm leading-relaxed">
                  {mood.tagline}
                </p>

                {/* Pulse effect when selected */}
                {selected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected Moods Display */}
        <AnimatePresence>
          {selectedMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8"
            >
              <div className="bg-gray-900/80 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Your Selected Vibes:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedMoods.map((mood) => (
                    <motion.div
                      key={mood.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`px-5 py-3 rounded-full bg-gradient-to-r ${mood.color} 
                        flex items-center gap-2 text-white font-semibold shadow-lg`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span>{mood.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
      <AnimatePresence>
        {selectedMoods.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl border-t border-purple-500/30"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="text-white">
                <p className="text-lg font-bold">
                  {selectedMoods.length} mood
                  {selectedMoods.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-sm text-gray-400">
                  Ready to find your perfect movies?
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 
                  shadow-2xl transition-all duration-300
                  ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/50"
                  } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Chat</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-gray-500 text-sm mt-12"
      >
        💡 Tip: More moods = Better recommendations. Mix and match your vibes!
      </motion.p>
    </div>
  );
};

export default MoodSelector;

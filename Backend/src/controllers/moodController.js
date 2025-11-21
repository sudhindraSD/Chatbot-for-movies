import { UserPreferences } from "../models/UserPreferences.js";

/**
 * Handle mood selection and update the user's mood streak.
 *
 * @route   POST /api/v1/mood/select
 * @access  Private (requires authentication)
 */
export const selectMood = async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user?._id;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find existing preferences for this user
    let prefs = await UserPreferences.findOne({ userId });

    if (!prefs) {
      // First time we are creating preferences for this user
      prefs = await UserPreferences.create({
        userId,
        lastMood: mood,
        moodStreak: {
          mood,
          count: 1,
        },
      });
    } else {
      // Update mood streak logic
      if (prefs.lastMood === mood) {
        // Same mood as last time => continue streak
        const currentCount = prefs.moodStreak?.count || 0;
        prefs.moodStreak = {
          mood,
          count: currentCount + 1,
        };
      } else {
        // Different mood => reset streak
        prefs.moodStreak = {
          mood,
          count: 1,
        };
      }

      prefs.lastMood = mood;
      await prefs.save();
    }

    const streakCount = prefs.moodStreak?.count || 1;
    let streakMessage = null;

    if (streakCount >= 3) {
      // Vibe streak roast messages by mood
      switch (mood.toLowerCase()) {
        case "action":
          streakMessage = "Action again? Adrenaline addiction is real 🔥";
          break;
        case "comedy":
          streakMessage = "Comedy streak! Laughter is the best medicine 😂";
          break;
        case "romance":
          streakMessage = "Romance hat-trick? Someone's in their feels 💕";
          break;
        case "horror":
          streakMessage = "Third horror? You good bro? 😰";
          break;
        default:
          streakMessage = "Same vibe? Respect the consistency 🎬";
      }
    }

    return res.status(200).json({
      success: true,
      mood,
      streakCount,
      streakMessage,
    });
  } catch (error) {
    console.error("[Mood] Error selecting mood:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to select mood",
      error: error.message,
    });
  }
};

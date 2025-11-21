import { UserPreferences } from "../models/UserPreferences.js";

/**
 * Get preferences for a user, creating an empty record if needed.
 *
 * @route   GET /api/v1/preferences/:userId?
 * @access  Private
 */
export const getPreferences = async (req, res) => {
  try {
    const paramUserId = req.params.userId;
    const authUserId = req.user?._id;
    const userId = paramUserId || authUserId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    let prefs = await UserPreferences.findOne({ userId });

    if (!prefs) {
      prefs = await UserPreferences.create({ userId });
    }

    return res.status(200).json({
      success: true,
      preferences: prefs,
    });
  } catch (error) {
    console.error("[Preferences] Error getting preferences:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get user preferences",
      error: error.message,
    });
  }
};

/**
 * Update user preferences document (upsert behavior).
 *
 * @route   PUT /api/v1/preferences/update
 * @access  Private
 */
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user?._id;
    const updates = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updates },
      {
        new: true, // return updated document
        upsert: true, // create if it doesn't exist
      }
    );

    return res.status(200).json({
      success: true,
      preferences: prefs,
    });
  } catch (error) {
    console.error("[Preferences] Error updating preferences:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update user preferences",
      error: error.message,
    });
  }
};

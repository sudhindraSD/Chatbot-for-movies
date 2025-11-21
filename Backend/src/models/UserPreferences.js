import mongoose, { Schema } from "mongoose";

/**
 * UserPreferences Model
 * ---------------------
 * Stores long-term preference data for a specific user.
 * This powers:
 *  - Default recommendation settings (genre, length, age rating)
 *  - Mood tracking + "Vibe Streak" feature
 *  - Personalized greetings for returning users
 */

const moodStreakSchema = new Schema(
  {
    // Current mood for the ongoing streak (e.g. "action", "romance")
    mood: {
      type: String,
      default: null,
    },
    // How many times in a row this mood has been selected
    count: {
      type: Number,
      default: 0,
    },
  },
  { _id: false } // Embedded subdocument only; no separate _id needed
);

const userPreferencesSchema = new Schema(
  {
    // Reference back to the main User document
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One preferences document per user
    },

    // Genres the user tends to pick (e.g. ["action", "romance"])
    favoriteGenres: {
      type: [String],
      default: [],
    },

    // Average preferred movie length: "short", "long", or "any"
    avgMovieLength: {
      type: String,
      enum: ["short", "long", "any"],
      default: "any",
    },

    // Age rating preference: "pg", "teen", "mature", or "any"
    ageRating: {
      type: String,
      enum: ["pg", "teen", "mature", "any"],
      default: "any",
    },

    // Last mood the user selected (e.g. "chill", "energetic")
    lastMood: {
      type: String,
      default: null,
    },

    // Mood streak information used for the "Vibe Streak" / roast feature
    moodStreak: {
      type: moodStreakSchema,
      default: () => ({ mood: null, count: 0 }),
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Export as a named model so it can be imported with `{ UserPreferences }`
export const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);

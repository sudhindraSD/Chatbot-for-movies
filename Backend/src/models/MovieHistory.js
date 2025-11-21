import mongoose, { Schema } from "mongoose";

/**
 * MovieHistory Model
 * ------------------
 * Stores an entry every time the user picks a movie.
 * Powers:
 *  - "Rewind" (last 5 movies)
 *  - Hot takes after each pick
 *  - Personalized context for returning users
 */

const movieHistorySchema = new Schema(
  {
    // Link back to the User who picked this movie
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // TMDB numeric movie ID
    movieId: {
      type: Number,
      required: true,
    },

    // Human-readable movie title
    movieTitle: {
      type: String,
      required: true,
    },

    // Poster image URL (from TMDB image base URL)
    moviePoster: {
      type: String,
      default: null,
    },

    // Main genre label used when the movie was recommended/picked
    genre: {
      type: String,
      default: null,
    },

    // Mood the user selected for this recommendation session
    mood: {
      type: String,
      default: null,
    },

    // When the movie was picked; defaults to now
    pickedAt: {
      type: Date,
      default: Date.now,
    },

    // Optional user reaction to the movie
    // "loved", "liked", "meh", "disliked", or null
    userReaction: {
      type: String,
      enum: ["loved", "liked", "meh", "disliked", null],
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for fast lookup of recent history per user
// Sorted by pickedAt descending for efficient "last 5" queries.
movieHistorySchema.index({ userId: 1, pickedAt: -1 });

export const MovieHistory = mongoose.model("MovieHistory", movieHistorySchema);

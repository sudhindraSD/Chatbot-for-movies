import mongoose, { Schema } from "mongoose";

/**
 * ConversationLog Model
 * ---------------------
 * Stores chat sessions between the user and the FlickPick bot.
 * Each document represents a single session (identified by sessionId)
 * and contains an ordered array of messages.
 */

const messageSchema = new Schema(
  {
    // Who sent the message: "user", "assistant", or "system"
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    // Actual text content of the message
    content: {
      type: String,
      required: true,
    },

    // Timestamp when this message was created
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationLogSchema = new Schema(
  {
    // Reference to the User who owns this conversation
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Session identifier provided by the frontend to group messages
    sessionId: {
      type: String,
      required: true,
    },

    // Array of messages (user + assistant + optional system messages)
    messages: {
      type: [messageSchema],
      default: [],
    },

    // Optional mood for this session (e.g. "chill", "energetic")
    mood: {
      type: String,
      default: null,
    },

    // Whether the user was considered "new" when this conversation started
    isNewUser: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt for session-level tracking
  }
);

// Index for quickly finding most recent sessions per user
conversationLogSchema.index({ userId: 1, createdAt: -1 });

export const ConversationLog = mongoose.model(
  "ConversationLog",
  conversationLogSchema
);

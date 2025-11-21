import api from "./api";
import {
  analyzeConversation,
  getNextQuestion,
  isConversationComplete as checkComplete,
  extractPreferences,
} from "../utils/conversationManager";

/**
 * Chat Service - ARJUNA-LEVEL PRECISION 🎯
 * Handles communication with the FlickPick AI chatbot
 * WITH INTELLIGENT STATE TRACKING TO PREVENT REPEATED QUESTIONS
 */

/**
 * Send a message to the chatbot and get a response
 * NOW WITH SMART CONVERSATION STATE TRACKING
 * @param {string} message - User's message
 * @param {string} sessionId - Unique session identifier
 * @param {string} mood - User's selected mood
 * @param {Array} conversationHistory - Array of previous messages
 * @param {Array} selectedMoods - Array of selected mood objects (for multi-mood)
 * @returns {Promise<Object>} Response with bot reply, isComplete flag, and preferences
 */
export const sendMessage = async (
  message,
  sessionId,
  mood = "chill",
  conversationHistory = [],
  selectedMoods = []
) => {
  try {
    // STEP 1: Analyze current conversation state
    console.log("[ChatService] Analyzing conversation state...");
    const state = analyzeConversation(conversationHistory);
    console.log("[ChatService] State:", state);

    // STEP 2: Check if conversation is already complete
    if (state.isComplete) {
      console.log(
        "[ChatService] Conversation complete! Returning preferences."
      );
      return {
        reply: "Perfect! Curating your cinema experience... 🎬✨",
        isComplete: true,
        preferences: extractPreferences(state),
      };
    }

    // STEP 3: Build STRICT system context that FORCES the bot to follow the flow
    const systemContext = `You are FlickPick, a brief movie recommendation bot. You are ARJUNA - focused, precise, never missing the target.

═══════════════════════════════════════
CRITICAL TRACKING - CONVERSATION STATE:
═══════════════════════════════════════
✓ Genre asked already: ${state.hasAskedGenre ? "YES ✓" : "NO ✗"}
✓ Length asked already: ${state.hasAskedLength ? "YES ✓" : "NO ✗"}  
✓ Rating asked already: ${state.hasAskedRating ? "YES ✓" : "NO ✗"}

${state.genreAnswer ? `User's genre preference: "${state.genreAnswer}"` : ""}
${state.lengthAnswer ? `User's length preference: "${state.lengthAnswer}"` : ""}
${state.ratingAnswer ? `User's rating preference: "${state.ratingAnswer}"` : ""}

═══════════════════════════════════════
YOUR NEXT RESPONSE MUST FOLLOW THIS:
═══════════════════════════════════════
${
  !state.hasAskedGenre
    ? "→ Ask about GENRE/TYPE of movie they want (max 8 words, casual tone)"
    : ""
}
${
  state.hasAskedGenre && !state.hasAskedLength
    ? "→ Ask about LENGTH/DURATION preference (max 8 words, casual)"
    : ""
}
${
  state.hasAskedLength && !state.hasAskedRating
    ? "→ Ask about RATING/MATURITY level (max 8 words, casual)"
    : ""
}
${
  state.hasAskedRating
    ? '→ Say EXACTLY: "Perfect! Curating your cinema experience... 🎬✨" and NOTHING ELSE'
    : ""
}

═══════════════════════════════════════
ARJUNA'S RULES - FOLLOW EXACTLY:
═══════════════════════════════════════
1. ONE question only per response
2. Maximum 10 words total
3. NO explanations, NO small talk
4. NEVER repeat a question you already asked
5. Be casual, fun, use emojis
6. If user gives unclear answer, accept it and move to next question
7. NO corporate speak, be cool and friendly

User's mood context: ${
      selectedMoods.length > 0
        ? selectedMoods.map((m) => m.name).join(", ")
        : mood
    }
(Use this for context but don't mention it explicitly)

Remember: You are ARJUNA. One shot, one question, perfect aim. No repetition. Move forward ONLY.`;

    // STEP 4: Send request to backend with full context
    console.log("[ChatService] Sending message with context...");
    const response = await api.post("/chat/message", {
      message,
      sessionId,
      systemContext,
      conversationHistory: conversationHistory.slice(-10), // Send last 10 messages for context
    });

    // STEP 5: Re-analyze state after bot response to check completion
    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: message },
      { role: "assistant", content: response.reply },
    ];
    const updatedState = analyzeConversation(updatedHistory);

    console.log("[ChatService] Updated state:", updatedState);

    // STEP 6: Return response with completion status
    return {
      reply: response.reply,
      isComplete: updatedState.isComplete,
      preferences: updatedState.isComplete
        ? extractPreferences(updatedState)
        : null,
    };
  } catch (error) {
    console.error("[ChatService] Error:", error);
    throw new Error(error.message || "Failed to send message");
  }
};

/**
 * Generate a unique session ID for a chat session
 * Format: session_[timestamp]_[random]
 * @returns {string} Unique session ID
 */
export const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `session_${timestamp}_${random}`;
};

/**
 * Check if bot message indicates completion
 * These phrases mean the bot is done asking questions
 * @param {string} message - Bot's message
 * @returns {boolean} True if conversation is complete
 */
export const isConversationComplete = (message) => {
  const completionPhrases = [
    "curating your picks",
    "curating fresh picks",
    "spinning the reel",
    "loading your movies",
    "getting your recommendations",
    "preparing your picks",
    "perfect! curating",
    "got it! spinning",
    "excellent choice! curating",
    "🎬", // Look for movie emoji as final indicator
  ];

  const lowerMessage = message.toLowerCase();

  // Check if message contains completion phrases
  const hasCompletionPhrase = completionPhrases.some((phrase) =>
    lowerMessage.includes(phrase)
  );

  // Also check if it's a very short message with movie emoji (likely the final message)
  const isFinalMessage = lowerMessage.includes("🎬") && message.length < 50;

  return hasCompletionPhrase || isFinalMessage;
};

/**
 * Extract quick reply options from bot message (if any)
 * Looks for patterns like "1) option" or "- option"
 * @param {string} message - Bot's message
 * @returns {Array<string>} Array of quick reply options
 */
export const extractQuickReplies = (message) => {
  const options = [];

  // Pattern 1: Numbered list (1) option, 2) option)
  const numberedPattern = /\d+\)\s*([^,\n]+)/g;
  let match;
  while ((match = numberedPattern.exec(message)) !== null) {
    options.push(match[1].trim());
  }

  // Pattern 2: Bullet list (- option, * option)
  if (options.length === 0) {
    const bulletPattern = /[-*]\s*([^,\n]+)/g;
    while ((match = bulletPattern.exec(message)) !== null) {
      options.push(match[1].trim());
    }
  }

  return options.slice(0, 5); // Max 5 quick replies
};

/**
 * Get mood name from mood ID
 * @param {string} moodId - Mood identifier
 * @returns {string} Mood display name
 */
export const getMoodName = (moodId) => {
  const moodMap = {
    energetic: "Energetic ⚡",
    chill: "Chill 😌",
    emotional: "Emotional 💔",
    thrilling: "Thrilling 🎢",
    fun: "Fun 🎉",
    deep: "Deep 🧠",
    romantic: "Romantic 💕",
    dark: "Dark 🌑",
    surprise: "Surprise Me 🎲",
  };
  return moodMap[moodId] || moodId;
};

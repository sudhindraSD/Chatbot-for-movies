// ═══════════════════════════════════════════════════════
// CONVERSATION STATE MANAGER
// Analyzes conversation history and determines next action
// Prevents bot from repeating questions - ARJUNA-LEVEL PRECISION
// ═══════════════════════════════════════════════════════

/**
 * Analyzes the conversation messages and determines what's been asked/answered
 * @param {Array} messages - Array of {role, content} message objects
 * @returns {Object} State object with flags and answers
 */
export const analyzeConversation = (messages) => {
  const state = {
    hasAskedGenre: false,
    hasAskedLength: false,
    hasAskedRating: false,
    genreAnswer: null,
    lengthAnswer: null,
    ratingAnswer: null,
    isComplete: false,
  };

  // Keywords for detection (cast a wide net to catch all variations)
  const genreKeywords = [
    "genre",
    "vibe",
    "type",
    "kind",
    "excited",
    "mood",
    "feeling",
    "style",
  ];
  const lengthKeywords = [
    "long",
    "quick",
    "watch",
    "time",
    "hour",
    "min",
    "length",
    "duration",
    "saga",
    "short",
  ];
  const ratingKeywords = [
    "rating",
    "friendly",
    "mature",
    "pg",
    "rated",
    "family",
    "kids",
    "adult",
  ];

  // Analyze each message pair (bot question + user answer)
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === "assistant") {
      const content = msg.content.toLowerCase();

      // Check what was asked by the bot
      if (genreKeywords.some((keyword) => content.includes(keyword))) {
        state.hasAskedGenre = true;
        // Get next user message as answer
        if (messages[i + 1] && messages[i + 1].role === "user") {
          state.genreAnswer = messages[i + 1].content;
        }
      }

      if (lengthKeywords.some((keyword) => content.includes(keyword))) {
        state.hasAskedLength = true;
        if (messages[i + 1] && messages[i + 1].role === "user") {
          state.lengthAnswer = messages[i + 1].content;
        }
      }

      if (ratingKeywords.some((keyword) => content.includes(keyword))) {
        state.hasAskedRating = true;
        if (messages[i + 1] && messages[i + 1].role === "user") {
          state.ratingAnswer = messages[i + 1].content;
        }
      }
    }
  }

  // Check if all questions answered
  state.isComplete =
    state.genreAnswer && state.lengthAnswer && state.ratingAnswer;

  return state;
};

/**
 * Generates the next appropriate question based on conversation state
 * @param {Object} state - State object from analyzeConversation()
 * @param {String} mood - User's selected mood
 * @param {Array} selectedMoods - Array of selected mood objects (for multi-mood)
 * @returns {String} Next question to ask
 */
export const getNextQuestion = (state, mood, selectedMoods = []) => {
  // Build mood context for greeting
  const moodNames =
    selectedMoods.length > 0
      ? selectedMoods.map((m) => getMoodEmoji(m.id)).join(" ")
      : getMoodEmoji(mood);

  // Opening greeting with mood context (only on first message)
  if (
    !state.hasAskedGenre &&
    (!state.messages || state.messages.length === 0)
  ) {
    const moodGreetings = {
      energetic: `Adrenaline time! ⚡ What genre gets you PUMPED?`,
      chill: `Easy vibes 😌 What genre you feeling?`,
      emotional: `Feels incoming 💔 What genre hits different?`,
      thrilling: `Edge-of-seat time 🎢 What genre?`,
      fun: `Party mode! 🎉 What genre brings the energy?`,
      deep: `Big brain hours 🧠 What genre makes you think?`,
      romantic: `Love is in the air 💕 What genre warms your heart?`,
      dark: `Into the void 🌑 What genre embraces the darkness?`,
    };
    return moodGreetings[mood] || `Yo! 🎬 ${moodNames} What genre?`;
  }

  // Question sequence - NEVER repeat!
  if (!state.hasAskedGenre) {
    return "Genre? (action/comedy/horror/drama/thriller/romance/sci-fi)";
  }

  if (!state.hasAskedLength) {
    return "Quick watch or epic saga? ⏱️";
  }

  if (!state.hasAskedRating) {
    return "Family-friendly or mature content? 🔞";
  }

  if (state.isComplete) {
    return "Perfect! Curating your cinema experience... 🎬✨";
  }

  return "What's your vibe?";
};

/**
 * Get emoji for mood type
 */
const getMoodEmoji = (moodId) => {
  const emojis = {
    energetic: "⚡",
    chill: "😌",
    emotional: "💔",
    thrilling: "🎢",
    fun: "🎉",
    deep: "🧠",
    romantic: "💕",
    dark: "🌑",
  };
  return emojis[moodId] || "🎬";
};

/**
 * Determines if conversation is complete and ready for movie recommendations
 * @param {Object} state - State object from analyzeConversation()
 * @returns {Boolean}
 */
export const isConversationComplete = (state) => {
  return state.isComplete;
};

/**
 * Extracts user preferences from conversation state
 * @param {Object} state - State object from analyzeConversation()
 * @returns {Object} Preferences object
 */
export const extractPreferences = (state) => {
  if (!state.isComplete) return null;

  return {
    genre: state.genreAnswer,
    length: state.lengthAnswer,
    rating: state.ratingAnswer,
  };
};

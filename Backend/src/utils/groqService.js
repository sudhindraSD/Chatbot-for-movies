import Groq from 'groq-sdk';
import { User } from '../models/user.model.js';
import { MovieHistory } from '../models/MovieHistory.js';
import { UserPreferences } from '../models/UserPreferences.js';

const FLICKPICK_SYSTEM_PROMPT = `You are FlickPick, an enthusiastic movie buddy AI with deep knowledge of cinema (Hollywood, Bollywood, Anime, World Cinema - you know it all). You're like that best friend who's seen everything and always knows what to recommend.

CORE PERSONALITY:
- Casual, friendly, and conversational (use "bro", "dude", "honestly" naturally)
- Genuinely excited about movies - share fun trivia, director insights, actor connections
- Remember EVERYTHING about past conversations with this user
- Reference specific movies the user told you about in previous chats
- Build on past conversations naturally like a real friend would

MEMORY & CONTINUITY (CRITICAL):
- When user mentions watching a movie, STORE IT MENTALLY and reference it later
- If user said they liked/disliked something before, remember and use that context
- After long gaps, greet warmly: "Yo! Been a while! Last time we talked about [specific movie]..."
- Connect new recommendations to their viewing history: "Since you loved [past movie], you'll dig..."
- Track their mood/preferences evolution over time

RECOMMENDATION STYLE:
- Always give 3-5 specific movie suggestions with brief, punchy reasons
- Include year, director if notable, and one-line pitch
- Honor ALL constraints strictly (no horror means NO HORROR, 90s means 90s only)
- Mix mainstream + hidden gems (don't shy away from Indian/International bangers if they fit)
- Ask follow-up questions about their current mood/vibe

CONVERSATION FLOW:
- NEW USERS: Ask 3 quick setup questions:
  1. "What genres get you hyped?" 
  2. "Prefer newer stuff or classics? Any era you vibe with?"
  3. "Mood check - light & fun or deep & intense?"
  
- RETURNING USERS: Jump straight in with:
  "Yo! What's good? Ready for another banger recommendation?"
  Reference their last conversation naturally

STRICT RULES:
- Never break character or mention you're an AI
- Don't recommend what they've already seen (check history)
- If they say a movie was good/bad, remember it permanently
- Match their energy level (excited = excited, chill = chill)
- Keep responses concise but packed with personality (3-5 sentences unless listing movies)

When giving movie suggestions, format like:
**Movie Title** (Year) - Director if notable
→ One punchy line about why it fits their vibe + genre tags

Example: 
**Whiplash** (2014) - Damien Chazelle
→ Intense jazz drummer drama that'll have you sweating. Brutal teacher, obsessed student, insane finale. [Drama, Music, Psychological]`;

class GroqService {
  constructor() {
    this.conversationMemory = new Map(); // userId -> messages array
    this.MAX_HISTORY_MESSAGES = 30; // Increased context window
    this.groq = null; // Lazy init
  }

  getGroqClient() {
    if (!this.groq) {
      if (!process.env.GROQ_API_KEY) {
        console.warn("GROQ_API_KEY is missing!");
      }
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return this.groq;
  }

  // Build conversation context from user's history
  async buildUserContext(userId) {
    try {
      const user = await User.findById(userId);
      const preferences = await UserPreferences.findOne({ userId });
      const movieHistory = await MovieHistory.find({ userId })
        .sort({ pickedAt: -1 })
        .limit(20);

      let contextSummary = '';

      // Add user preferences
      if (preferences) {
        contextSummary += `\nUSER PREFERENCES:\n`;
        contextSummary += `- Favorite Genres: ${preferences.favoriteGenres?.join(', ') || 'Not set'}\n`;
        contextSummary += `- Avg Length: ${preferences.avgMovieLength || 'Any'}\n`;
        contextSummary += `- Age Rating: ${preferences.ageRating || 'Any'}\n`;
        if (preferences.lastMood) {
          contextSummary += `- Last Mood: ${preferences.lastMood}\n`;
        }
      }

      // Add recent movie history
      if (movieHistory.length > 0) {
        contextSummary += `\nRECENT WATCH HISTORY (Do not recommend these):\n`;
        movieHistory.forEach(movie => {
          const reaction = movie.userReaction ? movie.userReaction.toUpperCase() : 'WATCHED';
          contextSummary += `- ${movie.movieTitle} (${movie.genre || 'Unknown'}) - User ${reaction} this\n`;
        });
      }

      return contextSummary;
    } catch (error) {
      console.error("Error building user context:", error);
      return "";
    }
  }

  // Initialize or get conversation memory
  getConversationHistory(userId) {
    if (!this.conversationMemory.has(userId.toString())) {
      this.conversationMemory.set(userId.toString(), []);
    }
    return this.conversationMemory.get(userId.toString());
  }

  // Add message to memory
  addToMemory(userId, role, content) {
    const history = this.getConversationHistory(userId);
    history.push({ role, content });

    // Keep only recent messages to avoid token limits
    if (history.length > this.MAX_HISTORY_MESSAGES) {
      // Always keep the system prompt (index 0) if it exists, and slice the rest
      // But since we rebuild system prompt on every chat start if empty, we can just slice end
      // Actually, better to just keep the last N messages.
      // The system prompt is usually injected dynamically or kept at index 0.
      // Let's just keep the last N.
      const recentMessages = history.slice(-this.MAX_HISTORY_MESSAGES);
      this.conversationMemory.set(userId.toString(), recentMessages);
    }
  }

  // Main chat function
  async chat(userId, userMessage, isNewUser = false) {
    try {
      const userIdStr = userId.toString();

      // 1. Get History
      let history = this.getConversationHistory(userIdStr);

      // 2. If history is empty (new session), inject System Prompt + Context
      if (history.length === 0) {
        const userContext = await this.buildUserContext(userId);
        const systemPrompt = `${FLICKPICK_SYSTEM_PROMPT}\n\nCURRENT USER CONTEXT:\n${userContext}\n\nUSER STATUS: ${isNewUser ? 'NEW USER (Ask setup questions)' : 'RETURNING USER (Welcome back)'}`;

        history.push({ role: 'system', content: systemPrompt });
      }

      // 3. Add User Message
      this.addToMemory(userIdStr, 'user', userMessage);

      // 4. Call Groq
      const groqClient = this.getGroqClient();
      const chatCompletion = await groqClient.chat.completions.create({
        messages: history,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9, // High creativity for "buddy" vibe
        max_tokens: 1024,
        top_p: 0.95
      });

      const assistantResponse = chatCompletion.choices[0]?.message?.content || "Yo, my brain fried for a sec. Say that again?";

      // 5. Add Assistant Response to Memory
      this.addToMemory(userIdStr, 'assistant', assistantResponse);

      return assistantResponse;

    } catch (error) {
      console.error('Groq API Error:', error);
      return "My bad, I'm having trouble connecting to the movie database right now. Try again in a sec!";
    }
  }

  // Clear conversation
  clearConversation(userId) {
    this.conversationMemory.delete(userId.toString());
  }

  // Refresh context (e.g. after watching a movie)
  async refreshContext(userId) {
    const userIdStr = userId.toString();
    // We simply clear the memory so the next chat re-builds the context with the new movie
    // Or we could try to splice the system prompt. Clearing is safer to ensure fresh context.
    // But we want to keep the conversation flow...

    // Better approach: Update the system prompt (index 0) if it exists
    const history = this.getConversationHistory(userIdStr);
    if (history.length > 0 && history[0].role === 'system') {
      const userContext = await this.buildUserContext(userId);
      // Preserve the original system prompt text, just update context
      // For simplicity, we'll just overwrite the whole system prompt with the new context
      const systemPrompt = `${FLICKPICK_SYSTEM_PROMPT}\n\nCURRENT USER CONTEXT:\n${userContext}\n\n(Context refreshed just now)`;
      history[0].content = systemPrompt;
    }
  }
}

export default new GroqService();

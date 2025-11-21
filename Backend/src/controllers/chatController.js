import GroqService from '../utils/groqService.js';
import { User } from '../models/user.model.js';
import { ChatHistory } from '../models/ChatHistory.js';
import { UserPreferences } from '../models/UserPreferences.js';

// Send a message to the AI
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Check if new user (no preferences set yet)
    const preferences = await UserPreferences.findOne({ userId });
    const isNewUser = !preferences || preferences.favoriteGenres?.length === 0;

    // Get AI response
    const aiResponse = await GroqService.chat(userId, message, isNewUser);

    // Save interaction to persistent DB log (optional, but good for analytics)
    await ChatHistory.create({
      userId,
      userMessage: message,
      aiResponse,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: aiResponse,
      isNewUser
    });

  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to process chat message"
    });
  }
};

// Refresh context (call this when user adds a movie to history)
export const refreshChatContext = async (req, res) => {
  try {
    const userId = req.user._id;
    await GroqService.refreshContext(userId);
    res.json({ success: true, message: 'Chat context refreshed with new data' });
  } catch (error) {
    console.error('Refresh Context Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Clear conversation history
export const clearChat = async (req, res) => {
  try {
    const userId = req.user._id;
    GroqService.clearConversation(userId);
    res.json({ success: true, message: 'Conversation memory cleared' });
  } catch (error) {
    console.error('Clear Chat Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

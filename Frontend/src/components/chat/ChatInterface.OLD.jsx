import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useApp } from "../../context/AppContext";
import * as chatService from "../../services/chatService";
import * as movieService from "../../services/movieService";
import toast from "react-hot-toast";

/**
 * ChatInterface - ARJUNA-LEVEL PRECISION Chat 🎯
 * Bot asks questions with ZERO repetition using intelligent state tracking
 */

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState("chill");
  const [isComplete, setIsComplete] = useState(false);
  const initialized = useRef(false);
  const {
    conversationHistory,
    addMessage,
    clearConversation,
    currentSessionId,
    setSessionId,
    setMovies,
    selectedMoods,
    selectedMood,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Get mood from route state or context
  useEffect(() => {
    const moodFromState = location.state?.mood || selectedMood || "chill";
    setMood(moodFromState);
    console.log("[ChatInterface] Mood set:", moodFromState);
  }, [location.state, selectedMood]);

  // Generate session ID and start conversation - ONLY ONCE
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log("[ChatInterface] INITIALIZING - First mount only");

      // Clear previous messages and start fresh FIRST
      clearConversation();

      const sessionId = chatService.generateSessionId();
      setSessionId(sessionId);
      console.log("[ChatInterface] Session ID generated:", sessionId);

      // Send initial greeting with mood context
      sendInitialMessage(sessionId);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  const sendInitialMessage = async (sessionId) => {
    setIsTyping(true);

    // Build mood context for greeting
    let moodContext = mood;
    const moodsToShow =
      selectedMoods && selectedMoods.length > 0 ? selectedMoods : [mood];

    setTimeout(() => {
      if (moodsToShow && moodsToShow.length > 0) {
        const moodNames = moodsToShow
          .map((moodId) => {
            const moodData = chatService.getMoodName(moodId);
            return moodData;
          })
          .filter(Boolean);

        const moodCount = moodNames.length;
        const moodText = moodNames.join(", ");

        addMessage(
          "assistant",
          `🎬 Welcome! I see you're vibing with: ${moodText}! ` +
            `Let's find your perfect watch. What genre gets you excited?`
        );
      } else {
        addMessage(
          "assistant",
          `🎬 Hey! Ready to find your perfect movie? What genre gets you excited?`
        );
      }
      setIsTyping(false);
    }, 800);
  };

  const handleSend = async (e) => {
    e?.preventDefault();

    console.log("[ChatInterface] handleSend triggered", {
      message,
      currentSessionId,
      isComplete,
      isTyping,
    });

    if (!message.trim()) {
      console.log("[ChatInterface] Empty message, ignoring");
      return;
    }

    if (!currentSessionId) {
      console.error("[ChatInterface] No session ID!");
      toast.error("Session not initialized. Please refresh!");
      return;
    }

    if (isComplete) {
      console.log("[ChatInterface] Conversation already complete");
      return;
    }

    if (isTyping) {
      console.log("[ChatInterface] Bot is typing, please wait");
      return;
    }

    console.log("[ChatInterface] Sending message:", message);
    console.log(
      "[ChatInterface] Current conversation history:",
      conversationHistory
    );

    // Add user message to UI immediately
    addMessage("user", message);
    const userMessage = message;
    setMessage("");
    setIsTyping(true);

    try {
      // Get selected moods array for better context
      const selectedMoodsArray =
        selectedMoods && selectedMoods.length > 0
          ? selectedMoods.map((id) => ({
              id,
              name: chatService.getMoodName(id),
            }))
          : [];

      // Call smart chat service with full context
      const response = await chatService.sendMessage(
        userMessage,
        currentSessionId,
        mood,
        conversationHistory,
        selectedMoodsArray
      );

      console.log("[ChatInterface] Response:", response);

      // Simulate bot typing delay for better UX
      setTimeout(() => {
        addMessage("assistant", response.reply);
        setIsTyping(false);

        // Check if conversation is complete
        if (response.isComplete) {
          console.log(
            "[ChatInterface] Conversation complete! Preferences:",
            response.preferences
          );
          setIsComplete(true);

          toast.success("Perfect! Spinning up your picks... 🎬", {
            duration: 2000,
          });

          // Fetch movies and navigate to slot machine
          setTimeout(async () => {
            setIsTyping(true);
            try {
              console.log(
                "[ChatInterface] Fetching movie recommendations with preferences:",
                response.preferences
              );

              // Combine mood and preferences into a single filter object
              const filters = {
                ...response.preferences,
                mood: mood, // Pass mood as fallback if genre is unclear
              };

              const moviesResponse = await movieService.getRecommendations(
                filters
              );
              console.log("[ChatInterface] Movies received:", moviesResponse);

              if (
                !moviesResponse.movies ||
                moviesResponse.movies.length === 0
              ) {
                throw new Error("No movies received");
              }

              setMovies(moviesResponse.movies);
              toast.success(
                `Found ${moviesResponse.movies.length} perfect picks! 🍿`,
                {
                  duration: 2000,
                }
              );

              // Navigate to slot machine
              setTimeout(() => {
                navigate("/movies");
              }, 1000);
            } catch (error) {
              console.error("[ChatInterface] Failed to fetch movies:", error);
              toast.error("Oops! Couldn't load movies. The projector broke 📽️");
              setIsTyping(false);
              setIsComplete(false);
            }
          }, 1500);
        }
      }, 1000);
    } catch (error) {
      console.error("[ChatInterface] Error sending message:", error);
      toast.error("Couldn't send message. Connection glitched! 🔌");
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chat with FlickPick
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Your personal cinema matchmaker 🎬
          </p>

          {/* Show selected moods */}
          {selectedMoods && selectedMoods.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 mr-2">Your vibes:</span>
              {selectedMoods.map((moodId) => (
                <span
                  key={moodId}
                  className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                >
                  {chatService.getMoodName(moodId)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 overflow-y-auto">
        <div className="space-y-4 mb-4">
          <AnimatePresence>
            {conversationHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md p-4 rounded-2xl shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-800 text-gray-100 border border-purple-500/30"
                  }`}
                >
                  <p className="text-sm md:text-base">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 p-4 rounded-2xl border border-purple-500/30 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-gray-400 text-sm">
                  FlickPick is typing...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-xl p-6">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1 bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

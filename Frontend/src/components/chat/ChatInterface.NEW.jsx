import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Film } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useApp } from "../../context/AppContext";
import api from "../../services/api";
import toast from "react-hot-toast";

/**
 * ChatInterface - CASUAL MOVIE CHAT
 * Just a friend talking about movies - NO preference collection!
 * Moods already selected, bot just vibes for 4-5 messages then says bye
 */

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { selectedMoods } = useApp();

  // Initial greeting
  useEffect(() => {
    const greeting =
      selectedMoods && selectedMoods.length > 0
        ? `Yo! I see you're vibing with ${selectedMoods.join(
            ", "
          )}! What's good bro? 🎬`
        : "Yo! What's good bro? Ready to find some fire movies? 🎬";

    setMessages([{ role: "assistant", content: greeting }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    const userMsg = inputMessage.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInputMessage("");
    setIsTyping(true);
    setMessageCount((prev) => prev + 1);

    try {
      // Send to Groq
      const response = await api.post("/chat/message", {
        message: userMsg,
        sessionId,
        conversationHistory: messages.slice(-8), // Last 8 messages for context
      });

      // Add bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.reply },
        ]);
        setIsTyping(false);

        // After 4-5 messages, check if bot said goodbye
        if (
          messageCount >= 3 &&
          (response.reply.toLowerCase().includes("check out") ||
            response.reply.toLowerCase().includes("go check") ||
            response.reply.toLowerCase().includes("your picks") ||
            response.reply.toLowerCase().includes("movies i picked"))
        ) {
          // Bot said goodbye! Navigate to movies after short delay
          setTimeout(() => {
            toast.success("Time to find your perfect movie! 🎬", {
              duration: 2000,
            });
            setTimeout(() => navigate("/movies"), 1000);
          }, 2000);
        }
      }, 800);
    } catch (error) {
      console.error("[Chat] Error:", error);
      setIsTyping(false);
      // Fallback response
      setTimeout(() => {
        const fallbackResponses = [
          "Yo that's fire! Cinema is life bro 🎬",
          "Sick taste! I love that vibe 🔥",
          "Bet! That's what I'm talking about 💯",
        ];
        const fallback =
          fallbackResponses[
            Math.floor(Math.random() * fallbackResponses.length)
          ];
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallback },
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  // Manual "Go to Movies" button after 3+ messages
  const goToMovies = () => {
    toast.success("Let's find your movies! 🎬");
    navigate("/movies");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Chat with FlickPick
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Your movie buddy 🎬 • Just vibing about cinema
            </p>
          </div>
          {messageCount >= 3 && (
            <Button
              onClick={goToMovies}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl"
            >
              <Film className="w-5 h-5 mr-2" />
              Go to Movies
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-6 py-4 rounded-2xl shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-900 border border-gray-800 text-gray-100"
                  }`}
                >
                  <p className="text-lg leading-relaxed">{msg.content}</p>
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
              <div className="bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  <span className="text-gray-400">FlickPick is typing...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-xl p-6">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Chat about movies..."
              disabled={isTyping}
              className="flex-1 bg-gray-900 border-gray-700 text-white text-lg px-6 py-6 rounded-xl focus:border-purple-500"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-3 text-center">
            Just vibe about movies! After a few messages, check out your picks
            🎬
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

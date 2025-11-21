import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Film, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import api from "../../services/api";
import toast from "react-hot-toast";

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Initial greeting - Just a placeholder until user types or we load history
    // Ideally we should fetch history from backend if we stored it there, 
    // but for now we start fresh or rely on the "welcome" from AI if we send an empty init?
    // Actually, let's just wait for user to type, or send a hidden "init" if we wanted.
    // For this "Buddy" vibe, let's just show a static welcome if empty.
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: "assistant",
                content: "Yo! FlickPick here. What's the movie mood today? 🎬"
            }]);
        }
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!inputMessage.trim() || isTyping) return;

        const userMsg = inputMessage.trim();

        // Optimistically add user message
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInputMessage("");
        setIsTyping(true);

        try {
            const response = await api.post("/chat/message", {
                message: userMsg
            });

            if (response.success) {
                setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
            } else {
                toast.error("Failed to get response");
            }
        } catch (error) {
            console.error("[Chat] Error:", error);
            toast.error("FlickPick is having a nap. Try again.");
        } finally {
            setIsTyping(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await api.delete("/chat/clear");
            setMessages([{
                role: "assistant",
                content: "Memory wiped! Who are you again? JK. What's up? 🎬"
            }]);
            toast.success("Chat history cleared");
        } catch (error) {
            toast.error("Failed to clear chat");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl p-4 md:p-6 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            FlickPick AI
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">
                            Your movie-obsessed best friend 🎬
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearChat}
                            className="text-gray-400 hover:text-red-400"
                            title="Clear Memory"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => navigate("/movies")}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl"
                        >
                            <Film className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:inline">Browse</span>
                        </Button>
                    </div>
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
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] md:max-w-xl px-6 py-4 rounded-2xl shadow-lg whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none"
                                        : "bg-gray-900 border border-gray-800 text-gray-100 rounded-tl-none"
                                        }`}
                                >
                                    <p className="text-base md:text-lg leading-relaxed">{msg.content}</p>
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
                            <div className="bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl rounded-tl-none">
                                <div className="flex items-center gap-2">
                                    <div className="flex space-x-1">
                                        <motion.div
                                            className="w-2 h-2 bg-purple-500 rounded-full"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-pink-500 rounded-full"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 bg-purple-500 rounded-full"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800 bg-black/50 backdrop-blur-xl p-4 md:p-6">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto">
                    <div className="flex gap-4">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask for a movie recommendation..."
                            disabled={isTyping}
                            className="flex-1 bg-gray-900 border-gray-700 text-white text-lg px-6 py-6 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                        />
                        <Button
                            type="submit"
                            disabled={!inputMessage.trim() || isTyping}
                            className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-105"
                        >
                            <Send className="w-6 h-6" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;

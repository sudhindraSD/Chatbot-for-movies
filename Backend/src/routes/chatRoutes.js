import { Router } from "express";
import { sendMessage, refreshChatContext, clearChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/v1/chat/message - Send message
router.post("/message", protect, sendMessage);

// POST /api/v1/chat/refresh - Refresh context (after movie watch)
router.post("/refresh", protect, refreshChatContext);

// DELETE /api/v1/chat/clear - Clear history
router.delete("/clear", protect, clearChat);

export default router;

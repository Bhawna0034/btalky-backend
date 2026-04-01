import express from "express";
import {
  deleteChat,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth.middleware";
const router = express.Router();
router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/chat/:id", protectRoute, deleteChat);
export default router;

import express from "express";
import {
  createConversation,
  getAllConversations,
  addMessage,
} from "../controllers/conversation.controller";

const router = express.Router();

router.post("/create-conversation", createConversation);
router.get("/get-all-conversations", getAllConversations);
router.post("/add-message", addMessage);

export default router;

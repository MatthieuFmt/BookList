import express from "express";
import {
  test,
  createConversation,
  getAllConversations,
} from "../controllers/conversation.controller";

const router = express.Router();

router.post("/create-conversation", createConversation);
router.get("/get-all-conversations", getAllConversations);
// router.post("/add-message", addMessage);
router.get("/", test);

export default router;

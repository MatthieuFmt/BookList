"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("../controllers/conversation.controller");
const router = express_1.default.Router();
router.post("/create-conversation", conversation_controller_1.createConversation);
router.get("/get-all-conversations", conversation_controller_1.getAllConversations);
router.post("/add-message", conversation_controller_1.addMessage);
exports.default = router;
//# sourceMappingURL=conversation.route.js.map
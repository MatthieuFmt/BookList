"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    idUsers: {
        type: [String],
        required: true,
        default: ["", ""],
        minlength: 2,
        maxlength: 2,
    },
    listMessages: {
        type: [
            {
                userId: { type: String },
                message: { type: String },
                date: { type: Date },
            },
        ],
        default: [],
    },
});
exports.Conversation = (0, mongoose_1.model)("Conversation", ConversationSchema);
//# sourceMappingURL=conversation.model.js.map
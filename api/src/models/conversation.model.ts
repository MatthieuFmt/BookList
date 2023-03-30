import { Schema, model, Document } from "mongoose";

interface IMessage {
  userId: string;
  message: string;
  date: Date;
}

export interface IConversation extends Document {
  idUsers: Array<string>;
  listMessages: Array<IMessage>;
}

const ConversationSchema = new Schema({
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
export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema
);

import { Schema, model, Document } from "mongoose";

interface IComments {
  userId: string;
  message: string;
  date: Date;
}

export interface IBook extends Document {
  title: string;
  author: string;
  date: Date;
  summary: string;
  listComments: Array<IComments>;
}

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date },
  summary: { type: String },
  listComments: {
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
export const Book = model<IBook>("Book", BookSchema);

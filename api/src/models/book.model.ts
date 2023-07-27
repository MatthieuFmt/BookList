import { Schema, model, Document } from "mongoose";

interface IRatings {
  userId: string;
  rating: number;
}

interface IComments {
  userPseudo: string;
  userPicture: string;
  message: string;
  date: Date;
}

export interface IBook extends Document {
  idApi: string;
  author: string;
  summary: string;
  category: string;
  imageLinks: string;
  title: string;
  publishedDate: Date;
  publisher: string;
  isbn: string;
  listComments: Array<IComments>;
  listRatings: Array<IRatings>;
}

const BookSchema = new Schema({
  idApi: { type: String, required: true },
  author: { type: String },
  summary: { type: String },
  category: { type: String },
  imageLinks: { type: String },
  title: { type: String, required: true },
  publishedDate: { type: Date },
  publisher: { type: String },
  isbn: { type: String },
  listComments: {
    type: [
      {
        userPseudo: { type: String, required: true },
        userPicture: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    default: [],
  },
  listRatings: {
    type: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    default: [],
  },
});

export const Book = model<IBook>("Book", BookSchema);

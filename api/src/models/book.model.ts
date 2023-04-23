import { Schema, model, Document } from "mongoose";

interface IRatings {
  userId: string;
  rating: Number;
}

interface IComments {
  userPseudo: string;
  userPicture: string;
  message: string;
  date: Date;
}

export interface IBook extends Document {
  idApi: string;
  coverPicture: string;
  title: string;
  author: string;
  date: Date;
  summary: string;
  listComments: Array<IComments>;
  listRatings: Array<IRatings>;
}

const BookSchema = new Schema({
  idApi: { type: String, required: true },
  coverPicture: { type: String },
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date },
  summary: { type: String },
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

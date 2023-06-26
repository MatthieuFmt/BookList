import { Schema, model, Document } from "mongoose";

export type BookListKey =
  | "listBooksToExchange"
  | "listBooksAlreadyRead"
  | "listWishBooks";

type UserBookLists = {
  [key in BookListKey]?: string[];
};

export interface IUser extends Document {
  pseudo: string;
  email: string;
  password: string;
  profilePicturePath: string;
  listRequestContacts: Array<string>;
  listContacts: Array<string>;
  listBooksToExchange: Array<string>;
  listBooksAlreadyRead: Array<string>;
  listWishBooks: Array<string>;
  listConversations: Array<string>;

  passwordResetToken: string | null;
  passwordResetExpires: number | null;
}

export type UserWithBookLists = IUser & UserBookLists;

const UserSchema = new Schema({
  pseudo: {
    type: String,
    required: [true, "Pseudo manquant"],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Email manquant"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicturePath: {
    type: String,
    default: "/upload/default-user.png",
  },
  listRequestContacts: { type: [String], default: [] },
  listContacts: { type: [String], default: [] },
  listBooksToExchange: { type: [String], default: [] },
  listBooksAlreadyRead: { type: [String], default: [] },
  listWishBooks: { type: [String], default: [] },
  listConversations: { type: [String], default: [] },

  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Number, default: null },
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model<IUser>("User", UserSchema);

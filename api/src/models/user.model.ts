import { Schema, model, Document } from "mongoose";

export type BookListKey =
  | "listFavoritesBooks"
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
  refreshToken: string;
  listRequestContacts: Array<string>;
  listContacts: Array<string>;
  listFavoritesBooks: Array<string>;
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
    required: [true, "Veuillez entrer un pseudo"],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Veuillez entrer un email"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // minlength: [1, "test"], // faut valider la longueur dans le controller car on récupère la valeur déjà hashé
    // maxlength: [3, "test"],
  },
  profilePicturePath: {
    type: String,
    default: "./src/uploads/default-picture.png",
  },
  refreshToken: { type: String, default: "" },
  listRequestContacts: { type: [String], default: [] },
  listContacts: { type: [String], default: [] },
  listFavoritesBooks: { type: [String], default: [] },
  listBooksAlreadyRead: { type: [String], default: [] },
  listWishBooks: { type: [String], default: [] },
  listConversations: { type: [String], default: [] },

  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Number, default: null },
});

export const User = model<IUser>("User", UserSchema);

import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  pseudo: string;
  email: string;
  password: string;
  profileImgPath: string;
  refreshToken: string;
  listContacts: Array<string>;
  listFavoritesBooks: Array<string>;
  listToReadBooks: Array<string>;
  listAlreadyReadBooks: Array<string>;
  listConversations: Array<string>;
}

const UserSchema = new Schema({
  pseudo: {
    type: String,
    // required: [true, "Veuillez entrer un pseudo"],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    // required: [true, "Veuillez entrer un email"],
    unique: true,
  },
  password: {
    type: String,
    // required: true,
    // minlength: [1, "test"], // faut valider la longueur dans le controller car on récupère la valeur déjà hashé
    // maxlength: [3, "test"],
  },
  profileImgPath: { type: String, default: "../assets/default-img.png" },
  refreshToken: { type: String, default: "" },
  listContacts: { type: [String], default: [] },
  listFavoritesBooks: { type: [String], default: [] },
  listToReadBooks: { type: [String], default: [] },
  listAlreadyReadBooks: { type: [String], default: [] },
  listConversations: { type: [String], default: [] },
});

export const User = model<IUser>("User", UserSchema);

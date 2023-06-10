import React from "react";

interface User {
  _id: string;
  pseudo: string;
  email: string;
  profilePicturePath: string;
  refreshToken: string;
  listRequestContacts: string[];
  listContacts: string[];
  listFavoritesBooks: string[];
  listBooksAlreadyRead: string[];
  listWishBooks: string[];
  listConversations: string[];
  passwordResetToken: string;
  passwordResetExpires: number;
  __v: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

// Création du contexte avec une valeur par défaut
const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export default UserContext;

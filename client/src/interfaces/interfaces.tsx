export interface User {
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

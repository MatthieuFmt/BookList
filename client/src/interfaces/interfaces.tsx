export interface UserInterface {
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
  [key: string]: any;
}

export interface BookInterface {
  idApi: string;
  author: string;
  summary: string;
  category: string;
  imageLinks: string;
  title: string;
  publishedDate: string;
  publisher: string;
  isbn: string;
  listComments: CommentInterface[];
  listRating: [];
}

export interface CommentInterface {
  userPseudo: string;
  userPicture: string;
  message: string;
  date: string;
  _id: string;
}

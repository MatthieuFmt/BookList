import { useContext, useState } from "react";
import { BookInterface, UserInterface } from "../../interfaces/interfaces";
import UserContext from "../../context/UserContext";
import { fetchApi } from "../../utils/api";

interface ButtonUpdateProps {
  bookInfos: BookInterface;
}

const ButtonUpdateList: React.FC<ButtonUpdateProps> = ({ bookInfos }) => {
  const { user, setUser } = useContext(UserContext);

  const [showAddList, setShowAddList] = useState(false);

  let newUser: UserInterface = {
    _id: user?._id as string,
    pseudo: user?.pseudo as string,
    email: user?.email as string,
    profilePicturePath: user?.profilePicturePath as string,
    listRequestContacts: user?.listRequestContacts as string[],
    listContacts: user?.listContacts as string[],
    listBooksToExchange: user?.listBooksToExchange as string[],
    listBooksAlreadyRead: user?.listBooksAlreadyRead as string[],
    listWishBooks: user?.listWishBooks as string[],
    listConversations: user?.listConversations as string[],
    passwordResetToken: user?.passwordResetToken as string,
    passwordResetExpires: user?.passwordResetExpires as number,
    __v: user?.__v as number,
  };

  const addToList = (bookId: string, list: string) => {
    fetchApi(`user/add-to-lists/${list}`, "POST", { bookId });

    if (!user || !user[list]?.includes(bookId)) {
      newUser[list] = [...newUser[list], bookId];

      setUser(newUser);
    }
  };

  const removeFromList = (bookId: string, list: string) => {
    fetchApi(`user/delete-from-lists/${list}`, "DELETE", { bookId });

    if (user?.[list].includes(bookId)) {
      newUser[list] = user[list].filter((id: string) => id !== bookId);
      setUser(newUser);
    }
  };

  return (
    <div
      className="button-update__add-list-container"
      onMouseEnter={() => setShowAddList(true)}
      onMouseLeave={() => setShowAddList(false)}
    >
      <button className="button-update__add-list-button">+</button>
      {showAddList && (
        <ul className="button-update__modal">
          {!user?.listWishBooks.includes(bookInfos.idApi) ? (
            <li
              className="button-update__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listWishBooks")}
            >
              + à lire
            </li>
          ) : (
            <li
              className="button-update__btn-add-list"
              onClick={() => removeFromList(bookInfos.idApi, "listWishBooks")}
            >
              - à lire
            </li>
          )}

          {!user?.listBooksAlreadyRead.includes(bookInfos.idApi) ? (
            <li
              className="button-update__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listBooksAlreadyRead")}
            >
              + déjà lu
            </li>
          ) : (
            <li
              className="button-update__btn-add-list"
              onClick={() =>
                removeFromList(bookInfos.idApi, "listBooksAlreadyRead")
              }
            >
              - déjà lu
            </li>
          )}

          {!user?.listBooksToExchange.includes(bookInfos.idApi) ? (
            <li
              className="button-update__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listBooksToExchange")}
            >
              + à échanger
            </li>
          ) : (
            <li
              className="button-update__btn-add-list"
              onClick={() =>
                removeFromList(bookInfos.idApi, "listBooksToExchange")
              }
            >
              - à échanger
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ButtonUpdateList;

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

  const addToList = (bookId: string, list: string) => {
    fetchApi(`user/add-to-lists/${list}`, "POST", { bookId });

    if (!user[list].includes(bookId)) {
      setUser((prevUser: UserInterface) =>
        Object.assign({}, prevUser, {
          [list]: [...prevUser[list], bookId],
        })
      );
    }
  };

  const removeFromList = (bookId: string, list: string) => {
    fetchApi(`user/delete-from-lists/${list}`, "DELETE", { bookId });

    if (user[list].includes(bookId)) {
      setUser((prevUser: UserInterface) => {
        const updatedList = prevUser[list].filter(
          (id: string) => id !== bookId
        );
        return { ...prevUser, [list]: updatedList };
      });
    }
  };

  return (
    <div
      className="book-card__add-list-container"
      onMouseEnter={() => setShowAddList(true)}
      onMouseLeave={() => setShowAddList(false)}
    >
      <button className="book-card__add-list-button">+</button>
      {showAddList && (
        <ul className="book-card__modal">
          {!user?.listWishBooks.includes(bookInfos.idApi) ? (
            <li
              className="book-card__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listWishBooks")}
            >
              + à lire
            </li>
          ) : (
            <li
              className="book-card__btn-add-list"
              onClick={() => removeFromList(bookInfos.idApi, "listWishBooks")}
            >
              - à lire
            </li>
          )}

          {!user?.listBooksAlreadyRead.includes(bookInfos.idApi) ? (
            <li
              className="book-card__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listBooksAlreadyRead")}
            >
              + déjà lu
            </li>
          ) : (
            <li
              className="book-card__btn-add-list"
              onClick={() =>
                removeFromList(bookInfos.idApi, "listBooksAlreadyRead")
              }
            >
              - déjà lu
            </li>
          )}

          {!user?.listFavoritesBooks.includes(bookInfos.idApi) ? (
            <li
              className="book-card__btn-add-list"
              onClick={() => addToList(bookInfos.idApi, "listFavoritesBooks")}
            >
              + favoris
            </li>
          ) : (
            <li
              className="book-card__btn-add-list"
              onClick={() =>
                removeFromList(bookInfos.idApi, "listFavoritesBooks")
              }
            >
              - favoris
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ButtonUpdateList;

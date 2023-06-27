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

    if (!user || !user[list]?.includes(bookId)) {
      setUser((prevUser: UserInterface) => {
        if (prevUser === null) {
          return prevUser;
        }

        const updatedUser = {
          ...prevUser,
          [list]: [...prevUser[list], bookId],
        };

        return updatedUser;
      });
      // if (user) {
      // user[list] = [...user[list], bookId];
      // }
    }
  };

  const removeFromList = (bookId: string, list: string) => {
    fetchApi(`user/delete-from-lists/${list}`, "DELETE", { bookId });

    if (user?.[list].includes(bookId)) {
      setUser((prevUser: UserInterface) => {
        const updatedList = prevUser[list].filter(
          (id: string) => id !== bookId
        );
        return { ...prevUser, [list]: updatedList };
      });

      // user[list] = user[list].filter((id: string) => id !== bookId);
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

import { useContext, useState } from "react";
import { BookInterface, UserInterface } from "../../interfaces/interfaces";
import { formatDate } from "../../utils/helpers";
import { fetchApi } from "../../utils/api";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  bookInfos: BookInterface;
  setBookListDisplay: React.Dispatch<React.SetStateAction<BookInterface[]>>;
  bookListDisplay: BookInterface[];
}

const BookCard: React.FC<BookCardProps> = ({
  bookInfos,
  setBookListDisplay,
  bookListDisplay,
}) => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [showAddList, setShowAddList] = useState(false);
  const [showLayout, setShowLayout] = useState(false);

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

      setBookListDisplay([
        ...bookListDisplay.filter((book) => book.idApi !== bookId),
      ]);
    }
  };

  const showBookPage = (bookId: string) => {
    navigate(`/book/${bookId}}`);
  };

  return (
    <article className="book-card">
      <div
        className="book-card__container-img"
        onMouseEnter={() => setShowLayout(true)}
        onMouseLeave={() => setShowLayout(false)}
        onClick={() => showBookPage(bookInfos.idApi)}
      >
        <img src={bookInfos.imageLinks} alt="image de couverture" />
        {showLayout && (
          <div className="book-card__layout">Voir la page du livre</div>
        )}
      </div>
      <div className="book-card__content">
        <div className="book-card__header">
          <h3 className="book-card__title">{bookInfos.title}</h3>

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
                    onClick={() =>
                      removeFromList(bookInfos.idApi, "listWishBooks")
                    }
                  >
                    - à lire
                  </li>
                )}

                {!user?.listBooksAlreadyRead.includes(bookInfos.idApi) ? (
                  <li
                    className="book-card__btn-add-list"
                    onClick={() =>
                      addToList(bookInfos.idApi, "listBooksAlreadyRead")
                    }
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
                    onClick={() =>
                      addToList(bookInfos.idApi, "listFavoritesBooks")
                    }
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
        </div>

        {bookInfos.author && (
          <p>
            <span>Auteur</span> {bookInfos.author}
          </p>
        )}

        {bookInfos.publisher && (
          <p>
            <span>Editeur</span> {bookInfos.publisher}
          </p>
        )}

        {bookInfos.publishedDate && (
          <p>
            <span>Date de sortie</span> {formatDate(bookInfos.publishedDate)}
          </p>
        )}

        {bookInfos.isbn && (
          <p>
            <span>ISBN</span> {bookInfos.isbn}
          </p>
        )}

        {bookInfos.category && (
          <p>
            <span>Catégorie</span> {bookInfos.category}
          </p>
        )}
      </div>
    </article>
  );
};

export default BookCard;

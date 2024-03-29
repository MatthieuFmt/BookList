import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BookInterface } from "../../interfaces/interfaces";
import { formatDate } from "../../utils/helpers";

import ButtonUpdateList from "../ButtonUpdateList/ButtonUpdateList";
import defaultBookCover from "../../assets/images/default-book.jpg";

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

  const [showLayout, setShowLayout] = useState(false);

  return (
    <article className="book-card">
      <div
        className="book-card__container-img"
        onMouseEnter={() => setShowLayout(true)}
        onMouseLeave={() => setShowLayout(false)}
      >
        <img
          src={bookInfos.imageLinks ? bookInfos.imageLinks : defaultBookCover}
          alt="image de couverture"
        />
        {showLayout && (
          <div
            className="book-card__layout"
            onClick={() => navigate(`/livre/${bookInfos.idApi}`)}
          >
            Voir la page du livre
          </div>
        )}
      </div>
      <div className="book-card__content">
        <div className="book-card__header">
          <h3 className="book-card__title">{bookInfos.title}</h3>
          <ButtonUpdateList bookInfos={bookInfos} />
        </div>

        {bookInfos.author && (
          <p>
            <span>Auteur </span> {bookInfos.author}
          </p>
        )}

        {bookInfos.publisher && (
          <p>
            <span>Editeur </span> {bookInfos.publisher}
          </p>
        )}

        {bookInfos.publishedDate && (
          <p>
            <span>Date de sortie </span> {formatDate(bookInfos.publishedDate)}
          </p>
        )}

        {bookInfos.isbn && (
          <p>
            <span>ISBN </span> {bookInfos.isbn}
          </p>
        )}

        {bookInfos.category && (
          <p>
            <span>Catégorie </span> {bookInfos.category}
          </p>
        )}
      </div>
    </article>
  );
};

export default BookCard;

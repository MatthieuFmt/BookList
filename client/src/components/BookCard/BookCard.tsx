import { BookInterface } from "../SearchList/SearchList";
import { useState } from "react";

interface BookCardProps extends BookInterface {
  id: number;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  volumeInfo: {
    title,
    authors,
    publisher,
    publishedDate,
    description,
    industryIdentifiers,
    categories,
    averageRating,
    imageLinks,
    previewLink,
  },
}) => {
  const [showAddList, setShowAddList] = useState(false);
  const [showLayout, setShowLayout] = useState(false);

  return (
    <article className="book-card">
      <div
        className="book-card__container-img"
        onMouseEnter={() => setShowLayout(true)}
        onMouseLeave={() => setShowLayout(false)}
      >
        <img src={imageLinks.thumbnail} alt="image de couverture" />
        {showLayout && (
          <div className="book-card__layout">Voir la page du livre</div>
        )}
      </div>
      <div className="book-card__content">
        <div className="book-card__header">
          <h3 className="book-card__title">{title}</h3>

          <div
            className="book-card__add-list-container"
            onMouseEnter={() => setShowAddList(true)}
            onMouseLeave={() => setShowAddList(false)}
          >
            <button className="book-card__add-list-button">+</button>
            {showAddList && (
              <ul className="book-card__modal">
                <li>+ à lire</li>
                <li>+ déjà lu</li>
                <li>+ favoris</li>
              </ul>
            )}
          </div>
        </div>
        <p>
          <span>Auteur</span> {authors}
        </p>
        <p>
          <span>Editeur</span> {publisher}
        </p>
        <p>
          <span>Date de sortie</span> {publishedDate}
        </p>
        <span>Résumé</span>
        <p>{description}</p>
      </div>
    </article>
  );
};

export default BookCard;

import { Link } from "react-router-dom";
import { BookInterface } from "../../pages/BookList/Booklist";

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
  return (
    <div className="cover">
      <div className="book">
        <label htmlFor={`page-1-${id}`} className="book__page book__page--1">
          <img src={imageLinks.thumbnail} alt="" />
        </label>

        <label htmlFor={`page-2-${id}`} className="book__page book__page--4">
          <div className="page__content">
            <div className="page__content-description">{description}</div>
            <Link
              to={`/book/${industryIdentifiers[0].identifier}`}
              className="book-page-link"
            >
              Page du livre
            </Link>
          </div>
        </label>

        {/* <!-- Resets the page --> */}
        <input type="radio" name="page" id={`page-1-${id}`} />

        {/* <!-- Goes to the second page --> */}
        <input type="radio" name="page" id={`page-2-${id}`} />

        <label className="book__page book__page--2">
          <div className="book__page-front">
            <div className="page__content">
              <h3 className="page__content-book-title">{title}</h3>
              <div className="page__content-author">{authors}</div>
              <div className="page__content-section-infos">
                <div className="page__content-info">
                  <span>Publié par</span> <br /> {publisher}
                </div>
                <div className="page__content-info">
                  <span>Date de sortie</span> <br /> {publishedDate}
                </div>
                <div className="page__content-info">
                  <span>Catégorie</span> <br /> {categories}
                </div>
                <div className="page__content-info">
                  <span>ISBN</span> <br /> {industryIdentifiers[0].identifier}
                </div>
              </div>
            </div>
          </div>

          <div className="book__page-back">
            <div className="page__content-lists">
              <button>+ Favoris</button>
              <button>+ A lire</button>
              <button>+ Déjà lu</button>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default BookCard;

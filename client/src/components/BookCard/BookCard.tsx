import { BookInterface } from "../../pages/BookList/Booklist";

interface BookCardProps extends BookInterface {
  id: number;
}

const BookCard: React.FC<BookCardProps> = ({ id }) => {
  return (
    <div className="cover">
      <div className="book">
        <label htmlFor={`page-1-${id}`} className="book__page book__page--1">
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/193203/1111.jpg"
            alt=""
          />
        </label>

        <label htmlFor={`page-2-${id}`} className="book__page book__page--4">
          <div className="page__content">
            <h1 className="page__content-title">titre</h1>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
              voluptates perspiciatis voluptatibus ratione laboriosam, eveniet
              totam expedita praesentium facilis nam asperiore
            </div>
          </div>
        </label>

        {/* <!-- Resets the page --> */}
        <input type="radio" name="page" id={`page-1-${id}`} />

        {/* <!-- Goes to the second page --> */}
        <input type="radio" name="page" id={`page-2-${id}`} />

        <label className="book__page book__page--2">
          <div className="book__page-front">
            <div className="page__content">
              <h3 className="page__content-book-title">Foundation</h3>
              <div className="page__content-author">Isaac Asimov</div>

              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem it
              </div>
            </div>
          </div>

          <div className="book__page-back">
            <div className="page__content">
              <h4 className="page__content-title">Contents</h4>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default BookCard;

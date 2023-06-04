import { useState } from "react";
import Carrousel from "../../components/Carousel/Carousel";
import { fetchApi } from "../../utils/api";
import test from "./test-api.json";
import BookCard from "../../components/BookCard/BookCard";

export interface BookInterface {
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    categories: string[];
    averageRating: number;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    previewLink: string;
  };
}

const Booklist = () => {
  const [arrayBooks, setArrayBooks] = useState<BookInterface[]>(test);

  const searchBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // le faire avec fetchApi
    // let newArray = fetch(
    //   "https://www.googleapis.com/books/v1/volumes?q=intitle:harry+potter&key=AIzaSyAVYpytKjjHfklW7B-z4IbV2P9xY3fahM4"
    // )
    //   .then((response) => response.json())

    //   .then((data) => {
    //     setArrayBooks(data.items);
    //     console.log(data);
    //   })
    //   .catch((err) => console.error(err));

    // setArrayBooks(newArray);
  };

  return (
    <div className="container book-list">
      {/* <Carrousel /> */}
      <div className="book-list__search">
        <form
          className="book-list__form-search"
          onSubmit={(e) => searchBook(e)}
        >
          <label htmlFor="book">Rechercher un livre</label>
          <input type="text" />
          <button type="submit">Valider</button>
        </form>

        <section className="book-list__cards">
          {arrayBooks.map((book, index) => {
            return (
              <BookCard key={index} volumeInfo={book.volumeInfo} id={index} />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Booklist;

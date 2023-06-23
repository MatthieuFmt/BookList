import { useState } from "react";
import Carrousel from "../Carousel/Carousel";
import { fetchApi } from "../../utils/api";
import test from "./test-api.json";
import BookCard from "../BookCard/BookCard";

export interface BookInterface {
  idApi: { type: String; required: true };
  author: { type: String; required: true };
  summary: { type: String };
  category: { type: String };
  imageLinks: { type: String };
  title: { type: String; required: true };
  publishedDate: { type: Date };
  publisher: { type: String };
  isbn: { type: String };
}

const Booklist = () => {
  const [arrayBooks, setArrayBooks] = useState<BookInterface[]>();

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

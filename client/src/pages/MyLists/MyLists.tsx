import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import BookCard from "../../components/BookCard/BookCard";
import { fetchApi } from "../../utils/api";
import { BookInterface } from "../../interfaces/interfaces";
import loupe from "../../assets/images/loupe.svg";

const MyLists = () => {
  const [activeList, setActiveList] = useState({
    search: true,
    read: false,
    toRead: false,
    favorite: false,
  });
  const [inputSearch, setInputSearch] = useState<string>("");

  const [bookListDisplay, setBookListDisplay] = useState<BookInterface[]>([]);
  const { user, setUser } = useContext(UserContext);

  const searchBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputSearch) return;

    const searchedBooks = await fetchApi("book/fetch-googlebook", "POST", {
      query: inputSearch,
    });

    setBookListDisplay(searchedBooks);
  };

  useEffect(() => {
    let list = "";
    if (activeList.toRead) list = "listWishBooks";
    if (activeList.read) list = "listBooksAlreadyRead";
    if (activeList.favorite) list = "listFavoritesBooks";
    if (activeList.search) setBookListDisplay([]);

    if (list !== "") {
      (async () => {
        const data = await fetchApi(`user/get-list/${list}`, "GET");
        setBookListDisplay(data);
      })();
    }
  }, [activeList]);

  return (
    <main className="container my-lists">
      <aside className="my-lists__sidebar">
        <div
          className={
            activeList.search
              ? "my-lists__title-list active"
              : "my-lists__title-list"
          }
          onClick={() =>
            setActiveList({
              search: true,
              read: false,
              toRead: false,
              favorite: false,
            })
          }
        >
          <div>Recherche</div>
        </div>
        <div
          className={
            activeList.toRead
              ? "my-lists__title-list active"
              : "my-lists__title-list"
          }
          onClick={() =>
            setActiveList({
              search: false,
              read: false,
              toRead: true,
              favorite: false,
            })
          }
        >
          <div>A lire</div>
          <div>({user?.listWishBooks.length})</div>
        </div>
        <div
          className={
            activeList.read
              ? "my-lists__title-list active"
              : "my-lists__title-list"
          }
          onClick={() =>
            setActiveList({
              search: false,
              read: true,
              toRead: false,
              favorite: false,
            })
          }
        >
          <div>Déjà lu</div>
          <div>({user?.listBooksAlreadyRead.length})</div>
        </div>
        <div
          className={
            activeList.favorite
              ? "my-lists__title-list active"
              : "my-lists__title-list"
          }
          onClick={() =>
            setActiveList({
              search: false,
              read: false,
              toRead: false,
              favorite: true,
            })
          }
        >
          <div>Favoris</div>
          <div>({user?.listFavoritesBooks.length})</div>
        </div>
      </aside>

      <section className="my-lists__content">
        {activeList.search && (
          <form
            className="my-lists__form-search"
            onSubmit={(e) => searchBook(e)}
          >
            <input
              type="text"
              placeholder="Rechercher un livre"
              onChange={(e) =>
                setInputSearch(e.target.value.replace(/ /g, "+"))
              }
            />
            <button type="submit">
              <img src={loupe} alt="loupe" className="icon" />
            </button>
          </form>
        )}

        {bookListDisplay?.map((book: BookInterface) => {
          return (
            <BookCard
              bookInfos={book}
              key={book.idApi}
              setBookListDisplay={setBookListDisplay}
              bookListDisplay={bookListDisplay}
            />
          );
        })}

        {bookListDisplay.length === 0 && !activeList.search && (
          <div className="my-lists__search-link">
            La liste est vide.
            <span
              onClick={() =>
                setActiveList({
                  search: true,
                  read: false,
                  toRead: false,
                  favorite: false,
                })
              }
            >
              Recherche des livres
            </span>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyLists;

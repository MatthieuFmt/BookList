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

  const { user } = useContext(UserContext);

  // liste des livres à afficher
  const [bookListDisplay, setBookListDisplay] = useState<BookInterface[]>([]);
  // valeur de l'input de recherche
  const [bookToSearch, setBookToSearch] = useState<string>("");

  // fonction qui permet de rechercher un livre dans l'API Google Books
  const searchBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookToSearch) return;

    const response: BookInterface[] = await fetchApi(
      "book/fetch-googlebook",
      "POST",
      {
        query: bookToSearch,
      }
    );

    if (response) {
      setBookListDisplay(response);
    }
  };

  useEffect(() => {
    let list = "";
    if (activeList.toRead) list = "listWishBooks";
    if (activeList.read) list = "listBooksAlreadyRead";
    if (activeList.favorite) list = "listBooksToExchange";
    if (activeList.search) setBookListDisplay([]);

    if (list !== "") {
      (async () => {
        const data = await fetchApi(`user/get-list/${list}`, "GET");
        setBookListDisplay(data);
      })();
    }
  }, [activeList]);

  return (
    <main data-testid="my-lists-rendered" className="container my-lists">
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
          data-testid="list-title-to-read"
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
          <div>A échanger</div>
          <div>({user?.listBooksToExchange.length})</div>
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
                setBookToSearch(e.target.value.replace(/ /g, "+"))
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

        {bookListDisplay?.length === 0 && !activeList.search && (
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

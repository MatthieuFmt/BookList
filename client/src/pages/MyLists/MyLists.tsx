import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import BookCard from "../../components/BookCard/BookCard";
import { fetchApi } from "../../utils/api";

const MyLists = () => {
  const [activeList, setActiveList] = useState({
    search: true,
    read: false,
    toRead: false,
    favorite: false,
  });
  const [bookIdList, setBookIdList] = useState<string[]>([]);
  // créer un bookInterface à la place de string
  const [bookListDisplay, setBookListDisplay] = useState<string[]>([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (activeList.toRead && user?.listWishBooks)
      setBookIdList(user.listWishBooks);

    if (activeList.read && user?.listBooksAlreadyRead)
      setBookIdList(user.listBooksAlreadyRead);

    if (activeList.favorite && user?.listFavoritesBooks)
      setBookIdList(user.listFavoritesBooks);

    // créer une fonction getBooksByIds qui prend en paramètre bookIdList et qui renvoie un tableau de livres pour boucler dessus
    // fetchApi("book/get-book-list", "POST", bookIdList).then((data) => setBookListDisplay(data));
  }, [activeList]);
  const searchBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const test = await fetchApi("book/get-book/1213", "GET");
    // const test = fetchApi(
    //   `https://www.googleapis.com/books/v1/volumes?q=Harry+Potter&${
    //     import.meta.env.VITE_GOOGLE_API_KEY
    //   }`,
    //   "GET"
    // );

    console.log(test);
  };

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
            <input type="text" placeholder="Rechercher un livre" />
            <button type="submit">P</button>
          </form>
        )}
        {/* book est un string = 111 (id du livre) dans la bdd pour l'instant ce qui crée une erreur, 
        il faut maintenant ajouter les livres en bdd et boucler dessus */}
        {/* {bookListDisplay.map((book) => {
            return <BookCard volumeInfo={book} />;
          })} */}
      </section>
    </main>
  );
};

export default MyLists;

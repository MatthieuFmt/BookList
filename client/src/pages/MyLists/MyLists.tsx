import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import BookCard from "../../components/BookCard/BookCard";
import { fetchApi } from "../../utils/api";

const MyLists = () => {
  const [activeList, setActiveList] = useState({
    read: false,
    toRead: true,
    favorite: false,
  });
  const [bookIdList, setBookIdList] = useState<string[]>([]);
  // créer un bookInterface à la place de string
  const [showedBookList, setShowedBookList] = useState<string[]>([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (activeList.toRead && user?.listWishBooks)
      setBookIdList(user.listWishBooks);

    if (activeList.read && user?.listBooksAlreadyRead)
      setBookIdList(user.listBooksAlreadyRead);

    if (activeList.favorite && user?.listFavoritesBooks)
      setBookIdList(user.listFavoritesBooks);

    // créer une fonction getBooksByIds qui prend en paramètre bookIdList et qui renvoie un tableau de livres pour boucler dessus
    // fetchApi("book/get-book-list", "POST", bookIdList).then((data) => setShowedBookList(data));
  }, [activeList]);

  return (
    <main className="container my-lists">
      <aside className="my-lists__sidebar">
        <div
          className={
            activeList.toRead
              ? "my-lists__title-list active"
              : "my-lists__title-list"
          }
          onClick={() =>
            setActiveList({ read: false, toRead: true, favorite: false })
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
            setActiveList({ read: true, toRead: false, favorite: false })
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
            setActiveList({ read: false, toRead: false, favorite: true })
          }
        >
          <div>Favoris</div>
          <div>({user?.listFavoritesBooks.length})</div>
        </div>
      </aside>

      <section>
        {/* book est un string = 111 (id du livre) dans la bdd pour l'instant ce qui crée une erreur, 
        il faut maintenant ajouter les livres en bdd et boucler dessus */}
        {/* {showedBookList.map((book) => {
            return <BookCard volumeInfo={book} />;
          })} */}
      </section>
    </main>
  );
};

export default MyLists;

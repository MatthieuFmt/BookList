import { useState } from "react";

const MyLists = () => {
  const [activeList, setActiveList] = useState({
    read: false,
    toRead: true,
    favorite: false,
  });

  return (
    <main className="container my-lists">
      <header className="my-lists__header">
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
          A lire
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
          Déjà lu
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
          Favoris
        </div>
      </header>

      <section>
        {
          // {activeList.toRead && user.listWishBook.map((book,index) => {return <BookCard key={index} volumeInfo={book.volumeInfo} id={index} />})
          // {activeList.read && <div>read</div>}
          // {activeList.favorite && <div>favorite</div>}
        }
      </section>
    </main>
  );
};

export default MyLists;

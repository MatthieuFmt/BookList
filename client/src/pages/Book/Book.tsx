import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserContext from "../../context/UserContext";
import { BookInterface, CommentInterface } from "../../interfaces/interfaces";

import ButtonUpdateList from "../../components/ButtonUpdateList/ButtonUpdateList";
import { formatDate } from "../../utils/helpers";
import { fetchApi } from "../../utils/api";

const Book = () => {
  const { id } = useParams();

  const { user } = useContext(UserContext);

  const [comment, setComment] = useState("");
  const [bookInfos, setBookInfos] = useState<BookInterface>({
    idApi: "",
    author: "",
    summary: "",
    category: "",
    imageLinks: "",
    title: "",
    publishedDate: "",
    publisher: "",
    isbn: "",
    listComments: [],
    listRating: [],
  });

  const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newCommentList = await fetchApi(
        `book/add-comment/${bookInfos.idApi}`,
        "POST",
        {
          userPseudo: user?.pseudo,
          userPicture: user?.profilePicturePath,
          message: comment,
          date: new Date(),
        }
      );

      bookInfos.listComments = newCommentList;

      setComment("");
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    (async () => {
      const book = await fetchApi(`book/get-book/${id}`, "GET");
      console.log(book);

      setBookInfos(book);
    })();
  }, [id]);
  console.log(bookInfos);

  return (
    <main className="container book-page">
      <section className="book-page__card">
        <img src={bookInfos?.imageLinks} alt="couverture du livre" />

        <div className="book-page__infos">
          <div className="book-page__header">
            <h3 className="book-page__title">{bookInfos?.title}</h3>
            <ButtonUpdateList bookInfos={bookInfos} />
          </div>

          <div className="book-page__other-infos">
            {bookInfos?.author && (
              <p>
                <span>Auteur</span> {bookInfos.author}
              </p>
            )}

            {bookInfos?.publisher && (
              <p>
                <span>Editeur</span> {bookInfos.publisher}
              </p>
            )}

            {bookInfos?.publishedDate && (
              <p>
                <span>Date de sortie</span>
                {formatDate(bookInfos.publishedDate)}
              </p>
            )}

            {bookInfos?.isbn && (
              <p>
                <span>ISBN</span> {bookInfos.isbn}
              </p>
            )}

            {bookInfos?.category && (
              <p>
                <span>Catégorie</span> {bookInfos.category}
              </p>
            )}
          </div>
          <div className="book-page__summary">
            {bookInfos?.summary && (
              <>
                <span>Résumé</span>
                <p>{bookInfos.summary}</p>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="book-page__comments">
        <form onSubmit={(e) => sendComment(e)}>
          <label htmlFor="comment">Laisser un avis</label>
          <div className="book-page__comment-inputs">
            <textarea
              id="comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            ></textarea>
            <button type="submit">Envoyer</button>
          </div>
        </form>

        <div className="book-page__comment-list">
          {bookInfos?.listComments.map((comment: CommentInterface) => (
            <div className="book-page__comment-card" key={comment._id}>
              <img
                src={
                  import.meta.env.VITE_API_BASE_URL + user?.profilePicturePath
                }
                alt="photo de profil"
              />
              <div className="book-page__comment-infos">
                <div className="book-page__comment-header">
                  <p className="book-page__comment-pseudo">
                    {comment.userPseudo}
                  </p>
                  <p className="book-page__comment-date">
                    {formatDate(comment.date)}
                  </p>
                </div>
                <p className="book-page__comment-message">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Book;

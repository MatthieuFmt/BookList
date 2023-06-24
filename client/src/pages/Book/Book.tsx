import { useLocation } from "react-router-dom";
import ButtonUpdateList from "../../components/ButtonUpdateList/ButtonUpdateList";
import { formatDate } from "../../utils/helpers";
import { useContext, useState } from "react";
import { fetchApi } from "../../utils/api";
import UserContext from "../../context/UserContext";
import { CommentInterface } from "../../interfaces/interfaces";

const Book = () => {
  const location = useLocation();
  const bookInfos = location.state;

  const { user, setUser } = useContext(UserContext);

  const [comment, setComment] = useState("");

  const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newCommentList = await fetchApi(
        `book/add-comment/${bookInfos.idApi}`,
        "POST",
        {
          userPseudo: user.pseudo,
          userPicture: user.profilePicturePath,
          message: comment,
          date: new Date(),
        }
      );

      bookInfos.listComments = newCommentList;
    } catch (err) {
      return;
    }

    setComment("");
  };

  return (
    <main className="container book-page">
      <section className="book-page__card">
        <img src={bookInfos.imageLinks} alt="couverture du livre" />

        <div className="book-page__infos">
          <div className="book-page__header">
            <h3 className="book-page__title">{bookInfos.title}</h3>
            <ButtonUpdateList bookInfos={bookInfos} />
          </div>

          <div className="book-page__other-infos">
            {bookInfos.author && (
              <p>
                <span>Auteur</span> {bookInfos.author}
              </p>
            )}

            {bookInfos.publisher && (
              <p>
                <span>Editeur</span> {bookInfos.publisher}
              </p>
            )}

            {bookInfos.publishedDate && (
              <p>
                <span>Date de sortie</span>{" "}
                {formatDate(bookInfos.publishedDate)}
              </p>
            )}

            {bookInfos.isbn && (
              <p>
                <span>ISBN</span> {bookInfos.isbn}
              </p>
            )}

            {bookInfos.category && (
              <p>
                <span>Catégorie</span> {bookInfos.category}
              </p>
            )}
          </div>
          <div className="book-page__summary">
            {bookInfos.summary && (
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
          <label htmlFor="comment">Ajouter un commentaire</label>
          <textarea
            id="comment"
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="submit">Envoyer</button>
        </form>

        <div className="book-page__comments-list">
          {bookInfos.listComments.map((comment: CommentInterface) => (
            <div className="book-page__comment" key={comment._id}>
              <div className="book-page__comment-header">
                <img
                  src="/api/src/uploads/default-user.png"
                  alt="photo de profil"
                />
                <p>{comment.userPseudo}</p>
              </div>
              <p className="book-page__comment-message">{comment.message}</p>
              <p className="book-page__comment-date">
                {formatDate(comment.date)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Book;

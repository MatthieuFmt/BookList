import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { fetchApi } from "../../utils/api";
import { ContactInterface } from "../../interfaces/interfaces";
import loupe from "../../assets/images/loupe.svg";
import Conversation from "../../components/Conversation/Conversation";

const Community = () => {
  const { user } = useContext(UserContext);

  const [contacts, setContacts] = useState([]);
  const [demandContact, setDemandContact] = useState([]);
  const [showDemandContact, setShowDemandContact] = useState(false);

  const [showConversation, setShowConversation] = useState(false);
  const [userToSpeak, setUserToSpeak] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const [usersSearch, setUsersSearch] = useState([]);

  // récupère la liste des contacts et celle des demande de contact de l'utilisateur connecté
  useEffect(() => {
    const listIdContacts = user?.listContacts;
    (async () => {
      const listContacts = await fetchApi("user/get-users", "POST", {
        listId: listIdContacts,
      });
      setContacts(listContacts);
    })();

    const listIdDemandContact = user?.listRequestContacts;
    (async () => {
      const listRequestContacts = await fetchApi("user/get-users", "POST", {
        listId: listIdDemandContact,
      });
      setDemandContact(listRequestContacts);
    })();
  }, []);

  // récupère des utilisateurs qui proposent le livre recherché à l'échange
  const searchUserToExchange = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const response = await fetchApi("user/get-users-to-exchange", "POST", {
      booksSearch: inputSearch,
    });

    setUsersSearch(response);
  };

  const addContact = async (idContact: string) => {
    try {
      await fetchApi(`user/request-contact/${idContact}`, "GET");
    } catch (err) {
      return alert(err);
    }

    return alert("Demande de contact envoyé");
  };

  const deleteContact = async (idContact: string) => {
    try {
      await fetchApi(`user/delete-contact/${idContact}`, "DELETE");
    } catch (err) {
      return alert(err);
    }

    setContacts(
      contacts.filter((contact: ContactInterface) => contact._id !== idContact)
    );
    return alert("Contact supprimé");
  };

  const responseRequestContact = async (idContact: string, res: string) => {
    try {
      await fetchApi(`user/response-request-contact`, "POST", {
        response: res,
        idUserSentRequest: idContact,
      });
    } catch (err) {
      return alert(err);
    }

    setDemandContact(
      demandContact.filter(
        (contact: ContactInterface) => contact._id !== idContact
      )
    );
  };

  const openConversation = (userToSpeak: string) => {
    setUserToSpeak(userToSpeak);
    setShowConversation(true);
  };

  return (
    <main className="container community">
      <aside className="community__sidebar">
        <ul>
          {contacts.map((contact: ContactInterface) => {
            return (
              <li key={contact._id}>
                <img
                  src={
                    import.meta.env.VITE_API_BASE_URL +
                    contact.profilePicturePath
                  }
                  alt="photo de profil"
                />
                <p onClick={() => openConversation(contact.pseudo)}>
                  {contact.pseudo}
                </p>
                <button
                  className="community__btn community__btn--delete"
                  title="Supprimer des contacts"
                  onClick={() => deleteContact(contact._id)}
                >
                  -
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {showConversation && (
        <Conversation
          userToSpeak={userToSpeak}
          setShowConversation={setShowConversation}
        />
      )}

      <section className="community__users-search">
        {demandContact.length > 0 && (
          <div
            className="community__modal-contact"
            onMouseEnter={() => setShowDemandContact(true)}
            onMouseLeave={() => setShowDemandContact(false)}
          >
            <div className="community__modal-img">?</div>
            {showDemandContact && (
              <div className="community__modal-content">
                <h4>Demande de contact</h4>
                <ul>
                  {demandContact.map((contact: ContactInterface) => {
                    return (
                      <li key={contact._id}>
                        <div className="community__user">
                          <img
                            src={
                              import.meta.env.VITE_API_BASE_URL +
                              contact.profilePicturePath
                            }
                            alt="photo de profil"
                          />
                          <p>{contact.pseudo}</p>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              responseRequestContact(contact._id, "accept")
                            }
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              responseRequestContact(contact._id, "decline")
                            }
                          >
                            -
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        <form
          className="community__form-search"
          onSubmit={searchUserToExchange}
        >
          <input
            type="text"
            placeholder="Rechercher un livre proposé à l'échange par un utilisateur"
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <button type="submit">
            <img src={loupe} alt="loupe" className="icon" />
          </button>
        </form>

        <ul className="community__users-list">
          {usersSearch.map((userSearch: any) => {
            return (
              <li key={userSearch._id} className="community__user-card">
                <img
                  src={
                    import.meta.env.VITE_API_BASE_URL +
                    userSearch.profilePicturePath
                  }
                  alt="photo de profil"
                />
                <div className="community__user-infos">
                  <div className="community__user-header">
                    <h4>{userSearch.pseudo}</h4>

                    {user?.listContacts.includes(userSearch._id) ? (
                      <button
                        className="community__btn community__btn--delete"
                        title="Supprimer des contacts"
                        onClick={() => deleteContact(userSearch._id)}
                      >
                        -
                      </button>
                    ) : (
                      <button
                        className="community__btn community__btn--add"
                        title="Ajouter aux contacts"
                        onClick={() => addContact(userSearch._id)}
                      >
                        +
                      </button>
                    )}
                  </div>

                  <div>
                    <p>
                      Livres à échanger {userSearch.listBooksToExchange.length}{" "}
                    </p>
                    <ul className="community__exchange-list">
                      {userSearch.listBooksToExchange.map(
                        (book: any, index: number) => {
                          return <li key={index}>{book}</li>;
                        }
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export default Community;

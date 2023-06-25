import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { fetchApi } from "../../utils/api";

interface ContactInterface {
  pseudo: string;
  profilePicturePath: string;
  _id: string;
}

const MyAccount = () => {
  const { user, setUser } = useContext(UserContext);

  const [contacts, setContacts] = useState([]);
  const [showLayout, setShowLayout] = useState(false);

  useEffect(() => {
    const listIdContacts = user?.listContacts;
    (async () => {
      const listContacts = await fetchApi("user/get-users", "POST", {
        listId: listIdContacts,
      });
      setContacts(listContacts);
    })();
  }, []);

  const updateProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetchApi(
        "user/update-profile-picture",
        "POST",
        formData
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log(data); // Afficher la réponse de l'API si nécessaire

        // Mettre à jour le chemin de l'image de profil dans l'état local ou le contexte de l'application
      } else {
        // Gérer les erreurs si nécessaire
      }
    } catch (error) {
      console.error(error);
      // Gérer les erreurs si nécessaire
    }
  };

  return (
    <main className="container my-account">
      <div className="my-account__header">
        <div
          className="my-account__picture-content"
          onMouseEnter={() => setShowLayout(true)}
          onMouseLeave={() => setShowLayout(false)}
        >
          {showLayout && (
            <>
              <div className="layout">Modifier l'image</div>
              <input
                type="file"
                className="layout"
                style={{ opacity: "0", height: "100%" }}
                onChange={(e) => updateProfilePicture(e)}
              />
            </>
          )}
          <img src={user?.profilePicturePath} alt="photo de profile" />
        </div>

        <h3>{user?.pseudo}</h3>
      </div>
      <div className="my-account__infos">
        <p>{user?.email}</p>
        <p>
          Livre déjà lus <span>{user?.listBooksAlreadyRead.length} </span>
        </p>
        <p>
          Livre à lire <span> {user?.listWishBooks.length} </span>
        </p>
        <p>
          Favoris <span> {user?.listWishBooks.length} </span>
        </p>

        <div className="my-account__contact-content">
          <p>Vos contacts</p>
          <ul>
            {contacts.map((contact: ContactInterface) => {
              return (
                <article className="my-account__contact-card">
                  <img
                    src="http://localhost:8000/uploads/default-user.png"
                    alt="photo de profil"
                  />
                  <li>{contact.pseudo}</li>
                </article>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MyAccount;

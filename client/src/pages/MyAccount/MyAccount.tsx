import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { fetchApi } from "../../utils/api";
import { ContactInterface } from "../../interfaces/interfaces";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const { user } = useContext(UserContext);

  const [contacts, setContacts] = useState([]);
  const [showLayout, setShowLayout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const listIdContacts = user?.listContacts;
    (async () => {
      const listContacts = await fetchApi("user/get-users", "POST", {
        listId: listIdContacts,
      });
      setContacts(listContacts);
    })();
  }, [user]);

  const updateProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.error("Aucun fichier sélectionné.");
      return;
    }

    const formData = new FormData();

    if (e.target.files?.[0]) {
      formData.append("file", e.target.files[0]);
      console.log(formData.get("file"));
    }
    return;

    try {
      const response = await fetchApi("user/update-profile-picture", "POST", {
        file: formData.get("file"),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
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
          <img
            src={import.meta.env.VITE_API_BASE_URL + user?.profilePicturePath}
            alt="photo de profile"
          />
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
          A échanger <span> {user?.listWishBooks.length} </span>
        </p>

        <div className="my-account__contact-content">
          {contacts.length > 0 && (
            <>
              <p>Vos contacts</p>
              <ul>
                {contacts.map((contact: ContactInterface) => {
                  return (
                    <article
                      className="my-account__contact-card"
                      key={contact._id}
                      onClick={() => navigate("/communaute")}
                    >
                      <img
                        src={
                          import.meta.env.VITE_API_BASE_URL +
                          contact.profilePicturePath
                        }
                        alt="photo de profil"
                      />
                      <li>{contact.pseudo}</li>
                    </article>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyAccount;

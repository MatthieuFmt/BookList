import React, { useState, Dispatch, SetStateAction, useContext } from "react";
import { fetchApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

interface ConnectionProps {
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  email: string;
}

type UserConnectionData = {
  email: string;
  password: string;
};

type ForgottenPasswordData = {
  email: string;
};

const Connection: React.FC<ConnectionProps> = ({
  setToggleModalConnection,
  setPassword,
  setEmail,
  password,
  email,
}) => {
  const [showInputForgotPassword, setShowInputForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const userData: UserConnectionData = {
        email,
        password,
      };

      const infoUser = await fetchApi("auth/connect", "POST", userData);

      if (!infoUser) {
        return alert("Erreur lors de la connexion");
      }

      if (infoUser.user) {
        if (process.env.NODE_ENV === "development") {
          infoUser.user.profilePicturePath =
            window.location.origin.replace("5173", "8000") +
            infoUser.user.profilePicturePath;
        } else {
          infoUser.user.profilePicturePath =
            window.location.origin + infoUser.user.profilePicturePath;
        }
      }

      setUser(infoUser.user);

      sessionStorage.setItem("accessToken", infoUser.accessToken);
      sessionStorage.setItem("refreshToken", infoUser.refreshToken);
      sessionStorage.setItem("userId", infoUser.user._id);

      setToggleModalConnection(false);
    } catch (err) {
      return console.error(err);
    }

    navigate("/bibliotheque");
  };

  const forgottenPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: ForgottenPasswordData = {
      email,
    };

    const response: any = await fetchApi(
      "auth/forgot-password",
      "POST",
      userData
    );

    if (response) {
      setEmailSent(true);
    }
  };

  return (
    <>
      <div
        className="layout"
        onClick={() => setToggleModalConnection(false)}
      ></div>
      <section className="modal">
        {showInputForgotPassword ? (
          <>
            <h3 className="modal__title">Mot de passe oublié</h3>

            {emailSent ? (
              <div className="modal__msg-email-sent">
                Un email a été envoyé à l'adresse {email}
              </div>
            ) : (
              <form className="modal__form" onSubmit={forgottenPassword}>
                <div className="modal__input-container">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email" className={email ? "filled" : ""}>
                    Adresse email
                  </label>
                </div>

                <div
                  className="modal__forgotten-password"
                  onClick={() => setShowInputForgotPassword(false)}
                >
                  retour
                </div>

                <button className="modal__btn">Envoyer</button>
              </form>
            )}
          </>
        ) : (
          <>
            <h3 className="modal__title">Connexion</h3>

            <form className="modal__form" onSubmit={login}>
              <div className="modal__input-container">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email" className={email ? "filled" : ""}>
                  Adresse email
                </label>
              </div>

              <div className="modal__input-container">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className={password ? "filled" : ""}>
                  Mot de passe
                </label>
              </div>

              <div
                className="modal__forgotten-password"
                onClick={() => setShowInputForgotPassword(true)}
              >
                Mot de passe oublié
              </div>

              <button className="modal__btn">Se connecter</button>
            </form>
          </>
        )}
      </section>
    </>
  );
};

export default Connection;

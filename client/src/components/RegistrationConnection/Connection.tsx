import React, { useState, Dispatch, SetStateAction } from "react";
import { fetchApi } from "../../utils/api";

interface ConnectionProps {
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
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
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showInputForgotPassword, setShowInputForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserConnectionData = {
      email,
      password,
    };

    await fetchApi("auth/connect", "POST", userData);
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
            <h3 className="modal__title">Mot de pass oublié</h3>

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

            <form className="modal__form" onSubmit={register}>
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
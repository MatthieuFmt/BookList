import React, { useState, Dispatch, SetStateAction } from "react";
import { fetchApi } from "../../utils/api";

type UserRegistrationData = {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegistrationProps {
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  email: string;
  password: string;
}

const Registration: React.FC<RegistrationProps> = ({
  setToggleModalRegistration,
  setToggleModalConnection,
  setPassword,
  setEmail,
  email,
  password,
}) => {
  const [pseudo, setPseudo] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserRegistrationData = {
      pseudo,
      email,
      password,
      confirmPassword,
    };

    const test = await fetchApi("auth/register", "POST", userData);
    console.log(test);
    if (test.errors) {
      return alert("Erreur lors de l'inscription");
    }

    setToggleModalRegistration(false);
    setToggleModalConnection(true);
    setEmail(email);
    setPassword(password);
  };

  return (
    <>
      <div
        className="layout"
        onClick={() => setToggleModalRegistration(false)}
      ></div>
      <section className="modal">
        <h3 className="modal__title">Inscription</h3>

        <form className="modal__form" onSubmit={(e) => register(e)}>
          <div className="modal__input-container">
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
            <label htmlFor="pseudo" className={pseudo ? "filled" : ""}>
              Pseudo
            </label>
          </div>

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

          <div className="modal__input-container">
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirm-password"
              className={confirmPassword ? "filled" : ""}
            >
              Confirmer le mot de passe
            </label>
          </div>

          <button className="modal__btn" type="submit">
            S'inscrire
          </button>
        </form>
      </section>
    </>
  );
};

export default Registration;

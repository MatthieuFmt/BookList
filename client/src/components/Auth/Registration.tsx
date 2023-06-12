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
}

const Registration: React.FC<RegistrationProps> = ({
  setToggleModalRegistration,
}) => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserRegistrationData = {
      pseudo,
      email,
      password,
      confirmPassword,
    };

    fetchApi("auth/register", "POST", userData);
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

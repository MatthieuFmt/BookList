import React, { useState, Dispatch, SetStateAction } from "react";
import { fetchApi } from "../../utils/api";

interface ConnectionProps {
  setTogglePopupConnection: Dispatch<SetStateAction<boolean>>;
}

type UserConnectionData = {
  email: string;
  password: string;
};

const Connection: React.FC<ConnectionProps> = ({
  setTogglePopupConnection,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserConnectionData = {
      email,
      password,
    };

    fetchApi("auth/connect", "POST", userData);
  };

  return (
    <>
      <div
        className="layout"
        onClick={() => setTogglePopupConnection(false)}
      ></div>
      <section className="popup">
        <h3 className="popup__title">Connexion</h3>

        <form className="popup__form" onSubmit={register}>
          <div className="popup__input-container">
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

          <div className="popup__input-container">
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

          <div className="popup__forgotten-password">Mot de passe oublié</div>

          <button className="popup__btn">Se connecter</button>
        </form>
      </section>
    </>
  );
};

export default Connection;

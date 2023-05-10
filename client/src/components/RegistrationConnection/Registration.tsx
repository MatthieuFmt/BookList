import { useState } from "react";

const Registration = () => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <div className="layout"></div>
      <section className="popup">
        <h3 className="popup__title">Inscription</h3>

        <form className="popup__form">
          <div className="popup__input-container">
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

          <div className="popup__input-container">
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

          <button className="popup__btn">S'inscrire</button>
        </form>
      </section>
    </>
  );
};

export default Registration;

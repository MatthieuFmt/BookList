import { useState } from "react";
import { fetchApi } from "../../utils/api";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();
  const token = location.pathname.split("/reset-password/")[1];

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetchApi(`auth/reset-password/${token}`, "post", {
      password,
      confirmPassword,
    });

    console.log(response);
  };

  return (
    <main className="container modal modal--reset-password">
      <h3 className="modal__title">Modification du mot de passe</h3>

      <form className="modal__form" onSubmit={(e) => resetPassword(e)}>
        <div className="modal__input-container">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className={password ? "filled" : ""}>
            Nouveau mot de passe
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
          Valider
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;

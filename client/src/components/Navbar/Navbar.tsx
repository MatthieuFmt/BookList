import React, { Dispatch, SetStateAction, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import books from "../../assets/images/books.svg";
import message from "../../assets/images/message.svg";
import exit from "../../assets/images/logout.svg";
import logo from "../../assets/images/logo.svg";

interface NavbarProps {
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  setToggleModalRegistration,
  setToggleModalConnection,
}) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    if (token === null) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="logo" className="logo" />
      </div>

      {!token ? (
        <div>
          <button
            className="navbar__btn"
            onClick={() => setToggleModalConnection(true)}
          >
            Connexion
          </button>

          <button
            className="navbar__btn"
            onClick={() => setToggleModalRegistration(true)}
          >
            Inscription
          </button>
        </div>
      ) : (
        <div className="navbar__links">
          <NavLink
            to="/bibliotheque"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            <img src={books} alt="livres" className="icon" />
            Bibliothèque
          </NavLink>

          <NavLink
            to="/messagerie"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            <img src={message} alt="livres" className="icon" />
            Messagerie
          </NavLink>
          <NavLink
            to="/mon-compte"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            Mon compte
          </NavLink>
          <button
            title="Se déconnecter"
            className="navbar__btn navbar__btn--log-out"
            onClick={logout}
          >
            <img src={exit} alt="déconnexion" className="icon" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

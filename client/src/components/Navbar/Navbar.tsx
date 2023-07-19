import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import books from "../../assets/images/books.svg";
import message from "../../assets/images/message.svg";
import exit from "../../assets/images/logout.svg";
import logo from "../../assets/images/logo.svg";
import UserContext from "../../context/UserContext";
import { fetchApi } from "../../utils/api";

interface NavbarProps {
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  setToggleModalRegistration,
  setToggleModalConnection,
}) => {
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("accessToken");

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      (async () => {
        const connectedUser = await fetchApi("user/get-connected-user", "GET");

        setUser(connectedUser);
      })();
    }
  }, [navigate]);

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
            to="/communaute"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            <img src={message} alt="livres" className="icon" />
            Communauté
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

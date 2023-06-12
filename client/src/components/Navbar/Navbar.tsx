import React, { Dispatch, SetStateAction, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { parseJwt } from "../../utils/api";

interface NavbarProps {
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  setToggleModalRegistration,
  setToggleModalConnection,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  useEffect(() => {
    if (token === null) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar__logo">LOGO</div>

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
          <NavLink
            to="/bibliotheque"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            test
          </NavLink>
        </div>
      ) : (
        <div className="navbar__links">
          <form
            className="navbar__form-search"
            // onSubmit={(e) => searchBook(e)}
          >
            <input type="text" placeholder="Rechercher un livre" />
            <button type="submit">P</button>
          </form>
          <NavLink
            to="/bibliotheque"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            Bibliothèque
          </NavLink>

          <NavLink
            to="/messagerie"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            Messagerie
          </NavLink>
          <NavLink
            to="/mon-compte"
            className={({ isActive }) => (isActive ? "link active" : "link")}
          >
            Mon compte
          </NavLink>
          <button className="navbar__btn navbar__btn--log-out" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

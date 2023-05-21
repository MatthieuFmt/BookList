import React, { Dispatch, SetStateAction } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";

interface NavbarProps {
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const NavbarConnection: React.FC<NavbarProps> = ({
  setToggleModalRegistration,
  setToggleModalConnection,
}) => {
  const location = useLocation();

  console.log(location);

  return (
    <nav className="navbar">
      <div className="navbar__logo">LOGO</div>

      {location.pathname === "/" ? (
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
          <NavLink to="/liste" className="link">
            debug
          </NavLink>
        </div>
      ) : (
        <div>
          <NavLink to="/liste" className="link">
            Mes livres
          </NavLink>
          <NavLink to="/messagerie" className="link">
            Messagerie
          </NavLink>
          <NavLink to="/mon-compte" className="link">
            Mon compte
          </NavLink>
          <button
            className="navbar__btn"
            onClick={() => setToggleModalRegistration(true)}
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarConnection;

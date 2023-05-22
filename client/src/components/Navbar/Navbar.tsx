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
            test
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
            className="navbar__btn navbar__btn--log-out"
            onClick={() => setToggleModalRegistration(true)}
          >
            Se déconnecter
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarConnection;

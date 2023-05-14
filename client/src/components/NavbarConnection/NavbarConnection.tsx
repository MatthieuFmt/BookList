import React, { useState, Dispatch, SetStateAction } from "react";
import Registration from "../RegistrationConnection/Registration";

interface RegistrationProps {
  toggleModalRegistration: boolean;
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  toggleModalConnection: boolean;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<RegistrationProps> = ({
  toggleModalRegistration,
  setToggleModalRegistration,
  toggleModalConnection,
  setToggleModalConnection,
}) => {
  return (
    <nav className="navbar-connection">
      <div className="navbar-connection__logo">LOGO</div>
      <div className="navbar-connection__btns-group">
        <button
          className="navbar-connection__btn"
          onClick={() => setToggleModalConnection(true)}
        >
          Connexion
        </button>

        <button
          className="navbar-connection__btn"
          onClick={() => setToggleModalRegistration(true)}
        >
          Inscription
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

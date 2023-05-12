import React, { useState, Dispatch, SetStateAction } from "react";
import Registration from "../RegistrationConnection/Registration";

interface RegistrationProps {
  togglePopupRegistration: boolean;
  setTogglePopupRegistration: Dispatch<SetStateAction<boolean>>;
  togglePopupConnection: boolean;
  setTogglePopupConnection: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<RegistrationProps> = ({
  togglePopupRegistration,
  setTogglePopupRegistration,
  togglePopupConnection,
  setTogglePopupConnection,
}) => {
  return (
    <nav className="navbar-connection">
      <div className="navbar-connection__logo">LOGO</div>
      <div className="navbar-connection__btns-group">
        <button
          className="navbar-connection__btn"
          onClick={() => setTogglePopupConnection(true)}
        >
          Connexion
        </button>

        <button
          className="navbar-connection__btn"
          onClick={() => setTogglePopupRegistration(true)}
        >
          Inscription
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

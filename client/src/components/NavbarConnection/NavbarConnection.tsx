import { useState } from "react";
import Registration from "../RegistrationConnection/Registration";

const Navbar = () => {
  const [togglePopupRegistration, setTogglePopupRegistration] = useState(false);
  const [togglePopupConnection, setTogglePopupConnection] = useState(false);

  return (
    <nav className="navbar-connection">
      <Registration />
      <div className="navbar-connection__logo">LOGO</div>
      <div className="navbar-connection__btns-group">
        <button
          className="navbar-connection__btn"
          onClick={() => setTogglePopupRegistration(true)}
        >
          Connexion
        </button>
        <button
          className="navbar-connection__btn"
          onClick={() => setTogglePopupConnection(true)}
        >
          Inscription
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

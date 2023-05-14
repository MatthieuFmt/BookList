import NavbarConnection from "../../components/NavbarConnection/NavbarConnection";

import { useState } from "react";
import Registration from "../../components/RegistrationConnection/Registration";
import Connection from "../../components/RegistrationConnection/Connection";

const Home = () => {
  const [toggleModalRegistration, setToggleModalRegistration] = useState(false);
  const [toggleModalConnection, setToggleModalConnection] = useState(false);

  return (
    <>
      <NavbarConnection
        toggleModalRegistration={toggleModalRegistration}
        setToggleModalRegistration={setToggleModalRegistration}
        toggleModalConnection={toggleModalConnection}
        setToggleModalConnection={setToggleModalConnection}
      />

      {toggleModalRegistration && (
        <Registration setToggleModalRegistration={setToggleModalRegistration} />
      )}

      {toggleModalConnection && (
        <Connection setToggleModalConnection={setToggleModalConnection} />
      )}

      <main className="container home">
        <div className="home__content">
          <h1 className="home__title">Booklist</h1>

          <article className="home__block-fonction">
            <div className="home__block-text">
              <h3 className="home__subtitle">fonctionnalité 1</h3>

              <p className="home__text">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
                nulla provident aliquid voluptatem ex molestias dicta, aut
                itaque. Commodi, nihil!
              </p>
            </div>

            <div className="home__img">image d'ilustration</div>
          </article>

          <article className="home__block-fonction">
            <div className="home__img">image d'ilustration</div>

            <div className="home__block-text home__block-text--right">
              <h3 className="home__subtitle">fonctionnalité 2</h3>

              <p className="home__text">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos
                nulla provident aliquid voluptatem ex molestias dicta, aut
                itaque. Commodi, nihil!
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};

export default Home;

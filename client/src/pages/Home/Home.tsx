import { Dispatch, SetStateAction, useContext } from "react";
import Registration from "../../components/Auth/Registration";
import Connection from "../../components/Auth/Connection";
import UserContext from "../../context/UserContext";

interface HomeProps {
  toggleModalRegistration: boolean;
  setToggleModalRegistration: Dispatch<SetStateAction<boolean>>;
  toggleModalConnection: boolean;
  setToggleModalConnection: Dispatch<SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = ({
  toggleModalRegistration,
  setToggleModalRegistration,
  toggleModalConnection,
  setToggleModalConnection,
}) => {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
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

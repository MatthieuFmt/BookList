import { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";

import { UserInterface } from "./interfaces/interfaces";

import Home from "./pages/Home/Home";
import ResetPassword from "./components/Auth/ResetPassword";
import Navbar from "./components/Navbar/Navbar";
import MyLists from "./pages/MyLists/MyLists";
import UserContext from "./context/UserContext";
import Book from "./pages/Book/Book";
import MyAccount from "./pages/MyAccount/MyAccount";
import { fetchApi } from "./utils/api";

function App() {
  const [toggleModalRegistration, setToggleModalRegistration] = useState(false);
  const [toggleModalConnection, setToggleModalConnection] = useState(false);

  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    (async () => {
      const connectedUser = await fetchApi("user/get-connected-user", "GET");

      if (connectedUser) {
        if (process.env.NODE_ENV === "development") {
          connectedUser.profilePicturePath =
            window.location.origin.replace("5173", "8000") +
            connectedUser.profilePicturePath;
        } else {
          connectedUser.profilePicturePath =
            window.location.origin + connectedUser.profilePicturePath;
        }
      }

      setUser(connectedUser);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">
        <Navbar
          setToggleModalConnection={setToggleModalConnection}
          setToggleModalRegistration={setToggleModalRegistration}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                toggleModalRegistration={toggleModalRegistration}
                setToggleModalRegistration={setToggleModalRegistration}
                toggleModalConnection={toggleModalConnection}
                setToggleModalConnection={setToggleModalConnection}
              />
            }
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/bibliotheque" element={<MyLists />} />
          <Route path="/livre" element={<Book />} />
          <Route path="/mon-compte" element={<MyAccount />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;

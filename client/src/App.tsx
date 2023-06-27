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
import Community from "./pages/Community/Community";

function App() {
  const [toggleModalRegistration, setToggleModalRegistration] = useState(false);
  const [toggleModalConnection, setToggleModalConnection] = useState(false);

  const [user, setUser] = useState<UserInterface | null>(null);

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
          <Route path="/livre/:id" element={<Book />} />
          <Route path="/mon-compte" element={<MyAccount />} />
          <Route path="/communautee" element={<Community />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;

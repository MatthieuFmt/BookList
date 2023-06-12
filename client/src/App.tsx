import { useState } from "react";

import { Route, Routes } from "react-router-dom";

import { User } from "./interfaces/interfaces";

import Home from "./pages/Home/Home";
import ResetPassword from "./components/Auth/ResetPassword";
import SearchList from "./components/SearchList/SearchList";
import Navbar from "./components/Navbar/Navbar";
import MyLists from "./pages/MyLists/MyLists";
import UserContext from "./context/UserContext";

function App() {
  const [toggleModalRegistration, setToggleModalRegistration] = useState(false);
  const [toggleModalConnection, setToggleModalConnection] = useState(false);

  const [user, setUser] = useState<User | null>(null);

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
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;

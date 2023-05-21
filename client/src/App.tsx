import { useState } from "react";

import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import ResetPassword from "./components/RegistrationConnection/ResetPassword";
import Booklist from "./pages/BookList/BooklistPage";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [toggleModalRegistration, setToggleModalRegistration] = useState(false);
  const [toggleModalConnection, setToggleModalConnection] = useState(false);

  return (
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
        <Route path="/liste" element={<Booklist />} />
      </Routes>
    </div>
  );
}

export default App;

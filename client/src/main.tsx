import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/main.scss";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <UserContext.Provider value={{ user: null, setUser: () => {} }}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserContext.Provider>
  </BrowserRouter>
);

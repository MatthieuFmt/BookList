import React from "react";
import { UserInterface } from "../interfaces/interfaces";

interface UserContextType {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
}

// Création du contexte avec une valeur par défaut
const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export default UserContext;

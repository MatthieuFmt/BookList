import React from "react";
import { User } from "../interfaces/interfaces";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void; // setUser peut maintenant accepter null
}

// Création du contexte avec une valeur par défaut
const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export default UserContext;

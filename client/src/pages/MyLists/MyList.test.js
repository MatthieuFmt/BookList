import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import MyLists from "./MyLists";

jest.mock("../../utils/api", () => ({
  fetchApi: jest.fn(),
}));

jest.mock("../../assets/images/loupe.svg", () => "loupe.svg");

describe("MyLists", () => {
  test("met à jour l'état inputSearch lorsque la valeur de l'input change", () => {
    // Rendu du composant
    render(<MyLists />);

    // Obtenir l'élément input
    const inputElement = screen.getByPlaceholderText("Rechercher un livre");

    // Simuler la saisie de l'utilisateur dans l'input
    fireEvent.change(inputElement, {
      target: { value: "Nouvelle valeur de recherche" },
    });

    // Vérifier si l'état inputSearch est mis à jour correctement
    expect(inputElement.value).toBe("Nouvelle valeur de recherche");
  });
});

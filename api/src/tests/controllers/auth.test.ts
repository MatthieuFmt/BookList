import bcrypt from "bcryptjs";
import { User } from "../../models/user.model";
import request from "supertest";
import app from "../../index";

// Simulation de jsonwebtoken pour les tests
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"), // Retourne toujours "mocked_token" lors de la signature d'un JWT
}));

// Début de la série de tests pour la route POST /auth/connect
describe("POST /auth/connect", () => {
  // Avant de commencer les tests
  beforeAll(async () => {
    // Création d'un faux utilisateur pour les tests
    const hashedPassword = await bcrypt.hash("azERTY123$", 10); // Hash du mot de passe
    await User.create({
      email: "test@mail.fr", // Email de l'utilisateur
      password: hashedPassword, // Mot de passe hashé
      confimPassword: hashedPassword, // Confirmation du mot de passe hashé
      pseudo: "test", // Pseudo de l'utilisateur
    });
  });

  // des identifiants valides devraient retourner l'utilisateur et les tokens
  it("devrait retourner l'utilisateur et les tokens pour des identifiants valides", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
      password: "azERTY123$",
    });

    expect(response.status).toBe(200); // Le statut de la réponse doit être 200
    expect(response.body).toHaveProperty("user"); // Le corps de la réponse doit avoir une propriété "user"
    expect(response.body).toHaveProperty("refreshToken", "mocked_token"); // Le corps de la réponse doit avoir une propriété "refreshToken" avec la valeur "mocked_token"
    expect(response.body).toHaveProperty("accessToken", "mocked_token"); // Le corps de la réponse doit avoir une propriété "accessToken" avec la valeur "mocked_token"
  });

  // un mot de passe incorrect devrait retourner une erreur
  it("devrait retourner une erreur pour un mot de passe incorrect", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400); // Le statut de la réponse doit être 400
    expect(response.body).toHaveProperty(
      "erreur",
      "Mot de passe ou email incorrect"
    ); // Le corps de la réponse doit avoir une propriété "erreur" avec la valeur "Mot de passe ou email incorrect"
  });

  // un utilisateur non existant devrait retourner une erreur
  it("devrait retourner une erreur pour un utilisateur non existant", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "nonexisting@mail.fr",
      password: "azERTY123$",
    });

    expect(response.status).toBe(400); // Le statut de la réponse doit être 400
    expect(response.body).toHaveProperty(
      "erreur",
      "Mot de passe ou email incorrect"
    ); // Le corps de la réponse doit avoir une propriété "erreur" avec la valeur "Mot de passe ou email incorrect"
  });

  // des champs manquants devraient retourner une erreur
  it("devrait retourner une erreur pour des champs manquants", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
    });

    expect(response.status).toBe(400); // Le statut de la réponse doit être 400
    expect(response.body).toHaveProperty(
      "erreur",
      "Veuillez remplir tous les champs"
    ); // Le corps de la réponse doit avoir une propriété "erreur" avec la valeur "Veuillez remplir tous les champs"
  });

  // Après tous les tests
  afterAll(async () => {
    await User.deleteOne({ email: "test@mail.fr" }); // Suppression de l'utilisateur test
  });
});

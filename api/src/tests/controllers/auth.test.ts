import bcrypt from "bcryptjs";
import { User } from "../../models/user.model";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../index";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

describe("POST /auth/connect", () => {
  beforeAll(async () => {
    // Création d'un faux utilisateur pour les tests
    const hashedPassword = await bcrypt.hash("azERTY123$", 10);
    await User.create({
      email: "test@mail.fr",
      password: hashedPassword,
      confimPassword: hashedPassword,
      pseudo: "test",
    });
  });

  it("should return user and tokens for valid credentials", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
      password: "azERTY123$",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("refreshToken", "mocked_token");
    expect(response.body).toHaveProperty("accessToken", "mocked_token");
  });

  it("should return error for incorrect password", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "erreur",
      "Mot de passe ou email incorrect"
    );
  });

  it("should return error for non-existing user", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "nonexisting@mail.fr",
      password: "azERTY123$",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "erreur",
      "L'utilisateur n'existe pas"
    );
  });

  it("should return error for missing fields", async () => {
    const response = await request(app).post("/auth/connect").send({
      email: "test@mail.fr",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "erreur",
      "Veuillez remplir tous les champs"
    );
  });

  afterAll(async () => {
    await User.deleteOne({ email: "test@mail.fr" });
  });
});

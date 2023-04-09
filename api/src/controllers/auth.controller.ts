import { Request, Response } from "express";

import { User, IUser } from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const tokenBlacklist = new Set<string>();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { pseudo, password, email } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère spécial, un chiffre et faire 8 caractères minimum",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      pseudo,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    // peut etre supprimer error dans les réponses
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ message: "Adresse email déjà enregistré" });
    }
    if (error.code === 11000 && error.keyPattern.pseudo) {
      return res.status(400).json({ message: "Le pseudo est déjà utilisé" });
    }

    return res.status(500).json({ message: error });
  }
};

export const connectUser = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const compare = await bcrypt.compare(password, user.password);

    if (compare) {
      // Générer un JWT
      const tokenPayload = {
        id: user._id,
        email: user.email,
      };

      const secret = process.env.JWT_SECRET;
      const options = { expiresIn: "1h" };

      const token = jwt.sign(tokenPayload, secret, options);

      return res.json({ message: "User connected", token });
    } else {
      return res
        .status(400)
        .json({ message: "Mot de passe ou email incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error });
  }
};

export const disconnectUser = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader;

    // Ajouter le token à la liste noire
    tokenBlacklist.add(token);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "User disconnected" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
};

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route auth ok" });
};
/////////////////////////////////////////////////////////////

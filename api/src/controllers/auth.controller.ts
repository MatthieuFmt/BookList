import { Request, Response } from "express";

import { User, IUser } from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

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
      const refreshTokenPayload = {
        id: user._id,
        email: user.email,
      };
      const accessTokenPayload = {
        id: user._id,
        email: user.email,
      };

      const refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      );

      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      user.refreshToken = refreshToken;
      await user.save();

      return res.json({
        message: "User connected",
        refresh: refreshToken,
        access: accessToken,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Mot de passe ou email incorrect" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error });
  }
};

export const disconnectUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  const authHeader = req.headers.authorization;

  const user = await User.findOne({ email });

  if (authHeader) {
    const token = authHeader;

    // Ajouter le token à la liste noire
    tokenBlacklist.add(token);

    user.refreshToken = "";
    await user.save();

    res.status(200).json({ message: "User disconnected" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
};

// à supprimer
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route auth ok" });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: tokenFromRequest } = req.body;

    if (!tokenFromRequest) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    jwt.verify(
      tokenFromRequest,
      process.env.REFRESH_TOKEN_SECRET,
      async (error: any, decodedPayload: any) => {
        if (error) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        const userId = decodedPayload.id;
        const user = await User.findById(userId);

        if (!user || user.refreshToken !== tokenFromRequest) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Générer un nouvel access token
        const accessTokenPayload = {
          id: user._id,
          email: user.email,
        };

        const newAccessToken = jwt.sign(
          accessTokenPayload,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          }
        );

        res.json({
          message: "Access token refreshed",
          access: newAccessToken,
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error refreshing access token", error });
  }
};

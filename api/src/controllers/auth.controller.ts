import { Request, Response } from "express";
import crypto from "crypto";
import { transport } from "../config/nodemailer.config";

import { User, IUser } from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const tokenBlacklist = new Set<string>();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { pseudo, password, email } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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

// étape 1 on se connecte pour créer un refreshToken et un accessToken
// le refreshToken est stocké en bdd et l'accessToken en local storage ou en cookie
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
        user: user,
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

// étape 3 si le front recois le code 401 au moment de l'étape 2 appel cette fonction
// la fonction recois le refresh token stocké en bdd pour recréer un nouveau accessToken si nécessaire
// si le refreshToken est lui aussi expiré alors le front redirige vers la page de connexion
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await user.save();

    const resetURL = `http://${req.headers.host}/reset-password/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.ADRESS_MAIL, // Remplacez par votre adresse e-mail
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      ${resetURL}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    transport.sendMail(mailOptions, (err: any) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send email" });
      }

      res.json({ message: "Password reset email sent" });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

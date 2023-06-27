import { Request, Response } from "express";
import crypto from "crypto";
import { transport } from "../config/nodemailer.config";

import { User, IUser } from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const tokenBlacklist = new Set<string>();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { pseudo, password, confirmPassword, email } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        erreur: "Les mots de passe ne sont pas identique",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        erreur:
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

    return res.status(201).json({ message: "Utilisateur inscrit" });
  } catch (error) {
    // peut etre supprimer error dans les réponses
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ erreur: "Adresse email déjà enregistré" });
    }
    if (error.code === 11000 && error.keyPattern.pseudo) {
      return res.status(400).json({ erreur: "Le pseudo est déjà utilisé" });
    }

    return res.status(500).json({ erreur: error });
  }
};

// étape 1 on se connecte pour créer un refreshToken et un accessToken
// le refreshToken est stocké en bdd et l'accessToken en local storage ou en cookie
export const connectUser = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ erreur: "User not found" });
    }

    const compare = await bcrypt.compare(password, user.password);

    if (compare) {
      // génère un token
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
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
      );

      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );

      await user.save();

      return res.json({
        user: user,
        refreshToken: refreshToken,
        accessToken: accessToken,
      });
    } else {
      return res
        .status(400)
        .json({ erreur: "Mot de passe ou email incorrect" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ erreur: "Erreur lors de la connexion", error });
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

    await user.save();

    res.status(200).json({ message: "User disconnected" });
  } else {
    res.status(400).json({ erreur: "No token provided" });
  }
};

// étape 3 si le front recois le code 401 au moment de l'étape 2 appel cette fonction
// la fonction recois le refresh token stocké en bdd pour recréer un nouveau accessToken si nécessaire
// si le refreshToken est lui aussi expiré alors le front redirige vers la page de connexion
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    const userId = req.body.userId;

    if (!refreshToken) {
      throw new Error();
    }

    const decoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ erreur: "Refresh token invalide" });
    }
    // Générer un nouvel access token
    const accessTokenPayload = {
      id: userId,
    };

    const newAccessToken = jwt.sign(
      accessTokenPayload,
      process.env.TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ erreur: "Une erreur s'est produite" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ erreur: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const timestampInOneHour = new Date().getTime() + 600000;

    user.passwordResetToken = token;
    user.passwordResetExpires = timestampInOneHour; // le token expire dans 10 minutes

    await user.save();

    const resetURL = `http://${process.env.APP_URL}/reset-password/${token}`;
    // l'url que doit appeler le front avec dans le body : email, password
    // const resetURL = `http://${req.headers.host}/auth/reset-password/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.ADRESS_MAIL,
      subject: "Password Reset",
      text: `Vous recevez ce message parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe pour votre compte.
      Veuillez cliquer sur le lien suivant ou copiez-le dans votre navigateur pour terminer le processus :
      ${resetURL}
      Si vous n'avez pas fait cette demande, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.`,
    };

    transport.sendMail(mailOptions, (erreur: Error | null) => {
      if (erreur) {
        return res.status(500).json({ erreur: erreur });
      }

      return res.status(200).json({ message: "Email envoyé" });
    });
  } catch (erreur) {
    console.error(erreur);
    res
      .status(500)
      .json({ erreur: "An error occurred while processing the request" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;

    const token = req.params.token;

    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return res.status(400).json({ erreur: "User not found" });
    }

    const dateExpireToken = user.passwordResetExpires;
    const dateNow = new Date().getTime();

    if (dateExpireToken < dateNow) {
      return res.status(401).json({ erreur: "Le token a expiré" });
    }

    if (password !== confirmPassword) {
      return res
        .status(403)
        .json({ erreur: "Les mots de passe ne correspondent pas" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        erreur:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère spécial, un chiffre et faire 8 caractères minimum",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.passwordResetExpires = 0;
    user.passwordResetToken = "";
    user.password = hashedPassword;

    await user.save();

    return res.json({ message: "Le mot de passe a été modifié" });
  } catch (error) {
    return res.status(500).json({
      erreur: "Erreur lors de l'enregistrement de l'utilisateur",
    });
  }
};

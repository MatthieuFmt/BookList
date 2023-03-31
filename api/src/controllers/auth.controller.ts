import { Request, Response } from "express";

import { User, IUser } from "../models/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const tokenBlacklist = new Set<string>();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { pseudo, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      pseudo,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
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
      const options = { expiresIn: "1h" }; // Configurez la durée de validité du JWT selon vos préférences

      const token = jwt.sign(tokenPayload, secret, options);

      return res.json({ message: "User connected", token });
    } else {
      return res.status(400).json({ message: "Incorrect password or email" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error connecting user", error });
  }
};

export const disconnectUser = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    // Ajouter le token à la liste noire
    tokenBlacklist.add(token);

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

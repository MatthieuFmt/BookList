import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: IUser = new User(req.body);

    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route utilisateur ok" });
};

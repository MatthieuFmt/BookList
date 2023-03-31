import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import bcrypt from "bcryptjs";

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

    const hashedPassword = (await User.findOne({ email })).password;
    const compare = await bcrypt.compare(password, hashedPassword);

    if (compare) {
    }

    // const user = await User.login(email, password);

    // const userToConnect: IUser = new User({
    //   password: hashedPassword,
    //   email,
    // });

    return res.json(compare);
    // res.status(201).json({ message: "User connected", user: userToConnect });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error connected user", error });
  }
};

export const disconnectUser = async (req: Request, res: Response) => {
  try {
    return res.json("disconnected");
    // res.status(201).json({ message: "User connected", user: userToConnect });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error disconnected user", error });
  }
};

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route auth ok" });
};
/////////////////////////////////////////////////////////////

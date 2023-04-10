import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/user.model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (typeof decodedToken === "string") {
      throw new Error("Invalid token");
    }

    const { id, email } = decodedToken as JwtPayload;

    req.user = { id, email, newAccessToken: null };

    next();
  } catch (error) {
    return res.status(401).json({ message: "" + error });
  }
};

export default authMiddleware;

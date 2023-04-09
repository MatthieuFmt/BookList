import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader;

  try {
    // return res.json(authHeader);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decodedToken === "string") {
      throw new Error("Invalid token");
    }

    const { id, email } = decodedToken as JwtPayload;

    req.user = { id, email };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" + error });
  }
};

export default authMiddleware;

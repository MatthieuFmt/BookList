import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}
// étape 2 on crée un middleware qui check si l'access token est encore valide à chaque appel api
// si l'access token n'est pas valide, renvoi erreur 401 au front qui se charge d'appeler la fonction refresToken()
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
    return res.status(401).json({ message: error });
  }
};

export default authMiddleware;

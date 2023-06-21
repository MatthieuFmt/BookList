import { Request, Response, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

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
    return res
      .status(401)
      .json({ erreur: "Le champ Authorization du header est manquant" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (typeof decodedToken === "string") {
      throw new Error("Token invalide");
    }

    const { id, email } = decodedToken as JwtPayload;

    req.user = { id, email, newAccessToken: null };

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({ erreur: "Une erreur s'est produite" });
  }
};

export default authMiddleware;

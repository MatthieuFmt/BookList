import { Request, Response, NextFunction } from "express";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: {
    id: string;
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
    // on vérifie que le token est valide
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as Secret);

    // si le token est invalide, decodedToken est une string
    if (typeof decodedToken === "string") {
      throw new Error("Token invalide");
    }

    const { id } = decodedToken as JwtPayload;

    // on ajoute l'id de l'utilisateur à la requête
    req.user = { id };

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({ erreur: "Une erreur s'est produite" });
  }
};

export default authMiddleware;

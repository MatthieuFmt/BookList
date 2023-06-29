"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// étape 2 on crée un middleware qui check si l'access token est encore valide à chaque appel api
// si l'access token n'est pas valide, renvoi erreur 401 au front qui se charge d'appeler la fonction refresToken()
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(401)
            .json({ erreur: "Le champ Authorization du header est manquant" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        if (typeof decodedToken === "string") {
            throw new Error("Token invalide");
        }
        const { id, email } = decodedToken;
        req.user = { id, email, newAccessToken: null };
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map
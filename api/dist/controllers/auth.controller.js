"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.disconnectUser = exports.connectUser = exports.createUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_config_1 = require("../config/nodemailer.config");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlacklist = new Set();
const createUser = async (req, res) => {
    try {
        const { pseudo, password, confirmPassword, email } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                erreur: "Les mots de passe ne sont pas identique",
            });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                erreur: "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère spécial, un chiffre et faire 8 caractères minimum",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.User({
            pseudo,
            password: hashedPassword,
            email,
        });
        await newUser.save();
        return res.status(201).json({ message: "Utilisateur inscrit" });
    }
    catch (error) {
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
exports.createUser = createUser;
// étape 1 on se connecte pour créer un refreshToken et un accessToken
// le refreshToken est stocké en bdd et l'accessToken en local storage ou en cookie
const connectUser = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ erreur: "User not found" });
        }
        const compare = await bcryptjs_1.default.compare(password, user.password);
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
            const refreshToken = jsonwebtoken_1.default.sign(refreshTokenPayload, process.env.TOKEN_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            });
            const accessToken = jsonwebtoken_1.default.sign(accessTokenPayload, process.env.TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            });
            await user.save();
            return res.json({
                user: user,
                refreshToken: refreshToken,
                accessToken: accessToken,
            });
        }
        else {
            return res
                .status(400)
                .json({ erreur: "Mot de passe ou email incorrect" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ erreur: "Erreur lors de la connexion", error });
    }
};
exports.connectUser = connectUser;
const disconnectUser = async (req, res) => {
    const { email } = req.body;
    const authHeader = req.headers.authorization;
    const user = await user_model_1.User.findOne({ email });
    if (authHeader) {
        const token = authHeader;
        // Ajouter le token à la liste noire
        tokenBlacklist.add(token);
        await user?.save();
        res.status(200).json({ message: "User disconnected" });
    }
    else {
        res.status(400).json({ erreur: "No token provided" });
    }
};
exports.disconnectUser = disconnectUser;
// étape 3 si le front recois le code 401 au moment de l'étape 2 appel cette fonction
// la fonction recois le refresh token stocké en bdd pour recréer un nouveau accessToken si nécessaire
// si le refreshToken est lui aussi expiré alors le front redirige vers la page de connexion
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const userId = req.body.userId;
        if (!refreshToken) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ erreur: "Refresh token invalide" });
        }
        // Générer un nouvel access token
        const accessTokenPayload = {
            id: userId,
        };
        const newAccessToken = jsonwebtoken_1.default.sign(accessTokenPayload, process.env.TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        return res.json({
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res) => {
    try {
        const user = await user_model_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ erreur: "User not found" });
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
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
        nodemailer_config_1.transport.sendMail(mailOptions, (erreur) => {
            if (erreur) {
                return res.status(500).json({ erreur: erreur });
            }
            return res.status(200).json({ message: "Email envoyé" });
        });
    }
    catch (erreur) {
        console.error(erreur);
        res
            .status(500)
            .json({ erreur: "An error occurred while processing the request" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const token = req.params.token;
        const user = await user_model_1.User.findOne({ passwordResetToken: token });
        if (!user) {
            return res.status(400).json({ erreur: "User not found" });
        }
        const dateExpireToken = user.passwordResetExpires;
        const dateNow = new Date().getTime();
        if (dateExpireToken && dateExpireToken < dateNow) {
            return res.status(401).json({ erreur: "Le token a expiré" });
        }
        if (password !== confirmPassword) {
            return res
                .status(403)
                .json({ erreur: "Les mots de passe ne correspondent pas" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                erreur: "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère spécial, un chiffre et faire 8 caractères minimum",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user.passwordResetExpires = 0;
        user.passwordResetToken = "";
        user.password = hashedPassword;
        await user.save();
        return res.json({ message: "Le mot de passe a été modifié" });
    }
    catch (error) {
        return res.status(500).json({
            erreur: "Erreur lors de l'enregistrement de l'utilisateur",
        });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersToExchange = exports.getPropositionContacts = exports.deleteContact = exports.responseRequestContact = exports.requestContact = exports.deleteProfilePicture = exports.updateProfilePicture = exports.getUsers = exports.getConnectedUser = exports.addToBooksLists = exports.getList = exports.deleteFromBooksLists = void 0;
const user_model_1 = require("../models/user.model");
const book_model_1 = require("../models/book.model");
const multer_config_1 = require("../config/multer.config");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const conversation_controller_1 = require("./conversation.controller");
function isBookListKey(value) {
    const validKeys = [
        "listBooksToExchange",
        "listBooksAlreadyRead",
        "listWishBooks",
    ];
    return validKeys.includes(value);
}
/**
 * Supprime un livre de la liste de lecture sélectionné dans "listparam" pour l'utilisateur connecté.
 *
 * @param {CustomRequest} req - La requête, contenant la clé de la liste de lecture et l'ID du livre à supprimer.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si le livre a été supprimé de la liste ou non.
 */
const deleteFromBooksLists = async (req, res) => {
    const listParam = req.params.list;
    if (!isBookListKey(listParam)) {
        return res.status(400).json({ erreur: "Invalid book list key" });
    }
    const list = listParam;
    const bookId = req.body.bookId;
    const id = req.user.id;
    try {
        const user = (await user_model_1.User.findById(id));
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        if (!user[list].includes(bookId)) {
            return res.status(400).json({
                erreur: "Le livre n'est pas présent dans la liste",
            });
        }
        const newList = user[list].filter((id) => {
            return id !== bookId;
        });
        user[list] = newList;
        user.save();
        return res
            .status(200)
            .json({ message: "Le livre a bien été supprimé de la liste" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.deleteFromBooksLists = deleteFromBooksLists;
const getList = async (req, res) => {
    try {
        const list = req.params.list;
        const userId = req.user.id;
        const user = await user_model_1.User.findById(userId);
        let listItems = [];
        if (user && list) {
            listItems = user.get(list);
        }
        else {
            throw new Error("Utilisateur ou liste invalide");
        }
        const listBooks = await book_model_1.Book.find({ idApi: listItems });
        return res.status(200).json(listBooks);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.getList = getList;
/**
 * Ajoute un livre à la liste de lecture sélectionné dans "listparam" pour l'utilisateur connecté.
 *
 * @param {CustomRequest} req - La requête, contenant la clé de la liste de lecture et l'ID du livre à ajouter.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si le livre a été ajouté à la liste.
 */
const addToBooksLists = async (req, res) => {
    const listParam = req.params.list;
    if (!isBookListKey(listParam)) {
        return res.status(400).json({ erreur: "Liste invalide" });
    }
    const list = listParam;
    const bookId = req.body.bookId;
    const id = req.user.id;
    try {
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        if (user[list].includes(bookId)) {
            return res
                .status(400)
                .json({ erreur: "Livre déjà présent dans la liste" });
        }
        user[list].push(bookId);
        user.save();
        return res.status(200).json({ message: "Livre ajouté à la liste" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.addToBooksLists = addToBooksLists;
/**
 *
 * Récupère un utilisateur en fonction de son id
 *
 * Cette fonction recherche dans la base de données un utilisateur en fonction de l'ID fourni.
 *
 * @param req - La requête HTTP reçue
 * @param res - La réponse HTTP à renvoyer
 * @returns la réponse HTTP avec l'utilisateur récupéré ou un message d'erreur
 */
const getConnectedUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.getConnectedUser = getConnectedUser;
const getUsers = async (req, res) => {
    try {
        const listId = req.body.listId;
        const listUsers = await user_model_1.User.find({ _id: { $in: listId } }).select([
            "pseudo",
            "profilePicturePath",
            "listBooksToExchange",
        ]);
        const processUserBooks = async () => {
            for (const user of listUsers) {
                const updatedBooks = await Promise.all(user.listBooksToExchange.map(async (bookId) => {
                    const titleBook = await book_model_1.Book.findOne({ idApi: bookId }).select("title");
                    return titleBook.title;
                }));
                user.listBooksToExchange = updatedBooks;
            }
        };
        await processUserBooks();
        if (!listUsers) {
            return res
                .status(404)
                .json({ erreur: "Les utilisateurs n'existent pas" });
        }
        return res.status(200).json(listUsers);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.getUsers = getUsers;
/**
 * Gère la mise à jour de l'image de profil d'un utilisateur.
 *
 * Cette fonction utilise le middleware Multer pour traiter le téléchargement
 * de l'image de profil. Elle renvoie une réponse appropriée en fonction du
 * résultat du téléchargement.
 *
 * @param req - Objet Request contenant les informations sur la requête HTTP entrante.
 * @param res - Objet Response utilisé pour renvoyer la réponse HTTP au client.
 */
const updateProfilePicture = async (req, res) => {
    try {
        (0, multer_config_1.upload)(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                res.status(400).send({ erreur: "Une erreur s'est produite" });
            }
            else if (err) {
                res.status(400).send({ erreur: "Une erreur s'est produite" });
            }
            else {
                if (!req.file) {
                    res.status(400).send({ erreur: "Aucun fichier sélectionné." });
                }
                else {
                    res.status(200).send({
                        message: "Photo de profil téléchargée avec succès.",
                        file: req.file,
                    });
                }
            }
        });
        const id = req.user.id;
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        user.profilePicturePath = `/uploads/${req.file.filename}`;
        user.save();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.updateProfilePicture = updateProfilePicture;
/**
 * Supprime la photo de profil d'un utilisateur et change la route vers l'image par défaut.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'ID de l'utilisateur.
 * @param {Response} res - La réponse HTTP à renvoyer.
 * @returns {Promise<Response>} Une réponse HTTP avec un message indiquant si la photo de profil a été supprimée ou non.
 * @throws {Error} Si une erreur se produit lors de la suppression de la photo de profil.
 */
const deleteProfilePicture = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        const filename = user.profilePicturePath;
        fs_1.default.unlink(filename, (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ erreur: "Erreur lors de la suppression du fichier" });
            }
            res.status(200).json({ message: "Fichier supprimé avec succès" });
        });
        user.profilePicturePath = "/uploads/default-user.png";
        user.save();
        return res
            .status(200)
            .json({ message: "La photo de profil a bien été supprimé" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.deleteProfilePicture = deleteProfilePicture;
/**
 * Envoie une demande de contact à un autre utilisateur.
 *
 * @param {CustomRequest} req - La requête, contenant l'ID de l'utilisateur connecté et l'ID de l'utilisateur à qui envoyer la demande.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si la demande de contact a été envoyée.
 */
const requestContact = async (req, res) => {
    try {
        const id = req.user.id;
        const idUserRequested = req.params.idUserRequested;
        const userRequested = await user_model_1.User.findById(idUserRequested);
        if (userRequested.listRequestContacts.includes(id)) {
            return res.status(400).json({
                erreur: "Une demande de contact à déjà été envoyé à cet utilisateur",
            });
        }
        userRequested.listRequestContacts.push(id);
        userRequested.save();
        return res.json({ message: "La demande de contact a bien été envoyée" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.requestContact = requestContact;
/**
 * Traite la réponse à une demande de contact.
 *
 * @param {CustomRequest} req - La requête contenant l'ID de l'utilisateur qui répond à la demande,
 * l'ID de l'utilisateur qui a envoyé la demande et la réponse ('accept' ou 'decline').
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant que la réponse a bien été renvoyé.
 */
const responseRequestContact = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await user_model_1.User.findById(id);
        const response = req.body.response;
        const idUserSentRequest = req.body.idUserSentRequest;
        const userSentRequest = await user_model_1.User.findById(idUserSentRequest);
        if (!user || !userSentRequest) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        const newListRequestContact = user.listRequestContacts.filter((id) => {
            return id !== idUserSentRequest;
        });
        if (user.listContacts.includes(idUserSentRequest)) {
            return res.status(400).json({
                erreur: "L'utilisateur est déjà présent da la liste des contacts",
            });
        }
        if (response === "accept") {
            user.listContacts.push(idUserSentRequest);
            userSentRequest.listContacts.push(id);
        }
        console.log(newListRequestContact);
        user.listRequestContacts = newListRequestContact;
        user.save();
        userSentRequest.save();
        return res.status(200).json({ message: "La réponse a bien été envoyé" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.responseRequestContact = responseRequestContact;
/**
 * Supprime de la liste des contacts de deux utilisateurs.
 * Supprime également la conversation entre les deux utilisateurs.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'ID de l'utilisateur et l'ID du contact à supprimer.
 * @param {Response} res - La réponse HTTP à renvoyer.
 * @returns {Promise<Response>} Une réponse HTTP avec un message indiquant que le contact a été supprimé.
 * @throws {Error} Si une erreur se produit lors de la suppression du contact.
 */
const deleteContact = async (req, res) => {
    try {
        const idUserConnected = req.user.id;
        const userConnected = await user_model_1.User.findById(idUserConnected);
        const idUserToDelete = req.params.idUserToDelete;
        const userToDelete = await user_model_1.User.findById(idUserToDelete);
        if (!userConnected || !userToDelete) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        if (!userConnected.listContacts.includes(idUserToDelete)) {
            return res.status(404).json({
                erreur: "L'utilisateur n'est pas dans la liste des contacts",
            });
        }
        const newListContactsUser = userConnected.listContacts.filter((id) => {
            return id.toString() !== idUserToDelete;
        });
        const newListContactsUserToDelete = userToDelete.listContacts.filter((id) => {
            return id.toString() !== idUserConnected;
        });
        userConnected.listContacts = newListContactsUser;
        userToDelete.listContacts = newListContactsUserToDelete;
        userConnected.save();
        userToDelete.save();
        (0, conversation_controller_1.deleteConversation)(req, res, idUserConnected, idUserToDelete);
        return res.status(200).json({
            message: "Le contact a bien été supprimé",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.deleteContact = deleteContact;
/**
 * Récupère les 10 premiers utilisateurs de la collection 'users'
 * en incluant uniquement les champs 'pseudo' et 'profilePicturePath'.
 *
 * @returns {Promise<Array<Object>>} Un tableau contenant les 10 premiers utilisateurs
 * @throws {Error} Si une erreur se produit lors de la récupération des utilisateurs
 */
const getPropositionContacts = async (req, res) => {
    try {
        const users = await user_model_1.User.find()
            .select("pseudo profilePicturePath")
            .limit(10)
            .exec();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.getPropositionContacts = getPropositionContacts;
const getUsersToExchange = async (req, res) => {
    try {
        const connectedUserId = req.user.id;
        const booksSearch = req.body.booksSearch;
        // Récupère les livres qui correspondent à la recherche
        const books = await book_model_1.Book.find({
            title: { $regex: booksSearch, $options: "i" },
        }).select("idApi title");
        const bookIds = books.map((book) => book.idApi);
        // Récupère les utilisateurs qui ont un livre qui correspond à la recherche et qui ne sont pas l'utilisateur connecté
        const users = await user_model_1.User.find({
            _id: { $ne: connectedUserId },
            listBooksToExchange: { $in: bookIds },
        }).select("pseudo profilePicturePath listBooksToExchange");
        // Parcourt chaque utilisateur et remplace les IDs des livres par leurs titres correspondants
        for (const user of users) {
            const updatedBooks = await book_model_1.Book.find({
                idApi: { $in: user.listBooksToExchange },
            }).select("title");
            user.listBooksToExchange = updatedBooks.map((book) => book.title);
        }
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Une erreur s'est produite");
    }
};
exports.getUsersToExchange = getUsersToExchange;
//# sourceMappingURL=user.controller.js.map
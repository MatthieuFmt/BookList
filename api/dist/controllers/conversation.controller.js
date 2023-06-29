"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.addMessage = exports.getAllConversations = exports.createConversation = void 0;
const conversation_model_1 = require("../models/conversation.model");
const user_model_1 = require("../models/user.model");
/**
 * Crée une nouvelle conversation entre l'utilisateur connecté et un autre utilisateur
 *
 * @param req - Requête HTTP personnalisée contenant l'ID de l'utilisateur connecté et
 *              l'ID de l'utilisateur à ajouter à la conversation dans le corps de la requête.
 * @param res - Réponse HTTP qui renvoie un message indiquant le résultat de la création
 *              de la conversation.
 * @returns Renvoie une réponse HTTP avec un code d'état approprié et un message indiquant
 *          si la conversation a été créée avec succès ou si une erreur s'est produite.
 */
const createConversation = async (req, res) => {
    try {
        const userToAdd = await user_model_1.User.findById(req.body.idUserToAdd).select("_id");
        const userConnected = await user_model_1.User.findById(req.user.id).select("_id listContacts");
        if (!userToAdd || !userConnected) {
            return res
                .status(404)
                .json({ erreur: "Un des utilisateurs n'existe pas" });
        }
        if (!userConnected.listContacts.find((contactId) => contactId.toString() === userToAdd._id.toString())) {
            return res.status(400).json({
                erreur: "Impossible de créer une conversation avec un utilisateur qui n'a pas accepté de demande de contact",
            });
        }
        const existingConversation = await conversation_model_1.Conversation.findOne({
            idUsers: {
                $all: [userToAdd.id, userConnected.id],
            },
        });
        if (existingConversation) {
            return res.status(400).json({
                erreur: "Une conversation entre ces utilisateurs existe déjà",
            });
        }
        const newConversation = new conversation_model_1.Conversation({
            idUsers: [userToAdd.id, userConnected.id],
        });
        await newConversation.save();
        // ajoute aux deux utilisateurs l'id de la conversation créé dans la colone "listConversations"
        await user_model_1.User.findByIdAndUpdate(userToAdd._id, {
            $push: { listConversations: newConversation._id },
        });
        await user_model_1.User.findByIdAndUpdate(userConnected._id, {
            $push: { listConversations: newConversation._id },
        });
        return res.status(200).json({
            message: "La conversation a bien été créé",
            idNewConversation: newConversation._id,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.createConversation = createConversation;
/**
 * Récupère toutes les conversations de l'utilisateur connecté.
 *
 * @param req - Requête HTTP personnalisée contenant l'ID de l'utilisateur connecté.
 * @param res - Réponse HTTP qui renvoie la liste des conversations de l'utilisateur connecté.
 * @returns Renvoie une réponse HTTP avec un code d'état approprié et la liste des conversations
 *          de l'utilisateur connecté, ou une erreur si une erreur s'est produite.
 */
const getAllConversations = async (req, res) => {
    try {
        const { listConversations } = await user_model_1.User.findById(req.user.id).select("listConversations");
        const list = [];
        for (const conversation of listConversations) {
            const newConversation = await conversation_model_1.Conversation.findById(conversation);
            list.push(newConversation);
        }
        return res.status(200).json(list);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.getAllConversations = getAllConversations;
/**
 * Ajoute un message à une conversation existante à laquelle l'utilisateur connecté
 * participe.
 *
 * @param req - Requête HTTP personnalisée contenant l'ID de l'utilisateur connecté,
 *              l'ID de la conversation et le message à ajouter dans le corps de la requête.
 * @param res - Réponse HTTP qui renvoie un message indiquant le résultat de l'ajout du message
 *              à la conversation.
 * @returns Renvoie une réponse HTTP avec un code d'état approprié et un message indiquant
 *          si le message a été ajouté avec succès à la conversation ou si une erreur
 *          s'est produite.
 */
const addMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const userId = req.user.id;
        const conversation = await conversation_model_1.Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ erreur: "La conversation n'existe pas" });
        }
        if (!conversation.idUsers.includes(userId)) {
            return res.status(403).json({ erreur: "Accès interdit" });
        }
        // Créer le nouvel objet message
        const newMessage = {
            userId: userId,
            message: message,
            date: new Date(),
        };
        conversation.listMessages.push(newMessage);
        await conversation.save();
        res.status(200).json({ message: "Le message a été envoyé" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.addMessage = addMessage;
/**
 * Supprime une conversation entre l'utilisateur connecté et un autre utilisateur.
 * Cette fonction est appelée par 'deleteContact' dans le contrôleur 'user.controller'.
 *
 * @param req - Requête HTTP personnalisée contenant l'ID de l'utilisateur connecté.
 * @param res - Réponse HTTP qui renvoie un message indiquant le résultat de la suppression
 *              de la conversation.
 * @param userConnected - L'ID de l'utilisateur connecté sous forme de chaîne de caractères.
 * @param userToDelete - L'ID de l'utilisateur avec lequel supprimer la conversation
 *                        sous forme de chaîne de caractères.
 * @returns Renvoie une réponse HTTP avec un code d'état approprié et un message indiquant
 *          si la conversation a été supprimée avec succès ou si une erreur s'est produite.
 */ const deleteConversation = async (req, res, userConnected, userToDelete) => {
    const conversationToDelete = await conversation_model_1.Conversation.findOne({
        idUsers: {
            $all: [userConnected, userToDelete],
        },
    });
    if (!conversationToDelete) {
        return res.status(404).json({ erreur: "Conversation not found" });
    }
    await conversation_model_1.Conversation.deleteOne({ _id: conversationToDelete._id });
};
exports.deleteConversation = deleteConversation;
//# sourceMappingURL=conversation.controller.js.map
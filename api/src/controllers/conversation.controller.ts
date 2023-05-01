import { Request, Response } from "express";
import { Conversation, IConversation } from "../models/conversation.model";
import { User } from "../models/user.model";

// placer cette interface dans un fichier à part et l'importer dans les trois controllers qui l'utilise
interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}

export const createConversation = async (req: CustomRequest, res: Response) => {
  try {
    const userToAdd = await User.findById(req.body.idUserToAdd).select("_id");
    const userConnected = await User.findById(req.user.id).select(
      "_id listContacts"
    );

    if (!userToAdd || !userConnected) {
      return res
        .status(404)
        .json({ message: "Un des deux utilisateurs n'existe pas" });
    }

    if (
      !userConnected.listContacts.find(
        (contactId) => contactId.toString() === userToAdd._id.toString()
      )
    ) {
      return res.status(400).json({
        message:
          "Impossible de créer une conversation avec un utilisateur qui n'a pas accepté de demande de contact",
      });
    }

    const existingConversation = await Conversation.findOne({
      idUsers: {
        $all: [userToAdd.id, userConnected.id],
      },
    });

    if (existingConversation) {
      return res.status(400).json({
        message: "Une conversation entre ces utilisateurs existe déjà",
      });
    }

    const newConversation: IConversation = new Conversation({
      idUsers: [userToAdd.id, userConnected.id],
    });

    await newConversation.save();

    // ajoute aux deux utilisateurs l'id de la conversation créé dans la colone "listConversations"
    await User.findByIdAndUpdate(userToAdd._id, {
      $push: { listConversations: newConversation._id },
    });
    await User.findByIdAndUpdate(userConnected._id, {
      $push: { listConversations: newConversation._id },
    });

    return res.status(200).json({
      message: "La conversation a bien été créé",
      idNewConversation: newConversation._id,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllConversations = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { listConversations } = await User.findById(req.user.id).select(
      "listConversations"
    );

    const list = [];
    for (const conversation of listConversations) {
      let newConversation = await Conversation.findById(conversation);
      list.push(newConversation);
    }

    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const addMessage = async (req: CustomRequest, res: Response) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.user.id;

    // Rechercher la conversation par son ID
    const conversation = await Conversation.findById(conversationId);

    // Vérifier si la conversation existe
    if (!conversation) {
      return res
        .status(404)
        .json({ message: "La conversation est introuvable" });
    }

    // Vérifier si l'utilisateur fait partie de la conversation
    if (!conversation.idUsers.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Vous ne faites pas partie de cette conversation" });
    }

    // Créer le nouvel objet message
    const newMessage = {
      userId: userId,
      message: message,
      date: new Date(),
    };

    // Ajouter le message à la liste des messages de la conversation
    conversation.listMessages.push(newMessage);

    // Sauvegarder la conversation mise à jour
    await conversation.save();

    // Réponse avec le message ajouté
    res.status(200).json({ message: "Le message a été envoyé" });
  } catch (error) {
    res.status(500).json("Une erreur s'est produite");
  }
};

// faire une fonction deleteConversation qui ne passe pas par une route mais directement appelé quand on supprime un utilisateur de sa liste de contact

export const test = (req: Request, res: Response) => {
  return res.status(201).json({ message: "route conversation ok" });
};

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
    const userConnected = await User.findById(req.user.id).select("_id");

    if (!userToAdd || !userConnected) {
      return res
        .status(404)
        .json({ message: "Un des deux utilisateurs n'existe pas" });
    }
    console.log(userConnected.id);

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

    // vérifier si les deux utilisateurs se sont ajouté comme contacte avant

    const newConversation: IConversation = new Conversation({
      idUsers: [userToAdd.id, userConnected.id],
    });

    await newConversation.save();

    // ajouter aux deux utilisateurs l'id de la conversation créé dans la colone "listConversations"

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
    const connectedUser = await User.findById(req.user.id);
  } catch (error) {}
};

export const test = (req: Request, res: Response) => {
  return res.status(201).json({ message: "route conversation ok" });
};

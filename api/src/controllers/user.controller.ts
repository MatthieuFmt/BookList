import { Request, Response } from "express";

import { BookListKey, User, UserWithBookLists } from "../models/user.model";
import { upload } from "../config/multer.config";

import multer from "multer";
import fs from "fs";

interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}

function isBookListKey(value: string): value is BookListKey {
  const validKeys: BookListKey[] = [
    "listFavoritesBooks",
    "listBooksAlreadyRead",
    "listWishBooks",
  ];
  return validKeys.includes(value as BookListKey);
}

/**
 * Supprime un livre de la liste de lecture sélectionné dans "listparam" pour l'utilisateur connecté.
 *
 * @param {CustomRequest} req - La requête, contenant la clé de la liste de lecture et l'ID du livre à supprimer.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si le livre a été supprimé de la liste ou non.
 */
export const deleteFromBooksLists = async (
  req: CustomRequest,
  res: Response
) => {
  const listParam = req.params.list;

  if (!isBookListKey(listParam)) {
    return res.status(400).json({ message: "Invalid book list key" });
  }

  const list: BookListKey = listParam;

  const bookId = req.body.bookId;
  const id = req.user.id;

  try {
    const user = (await User.findById(id)) as UserWithBookLists;

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (!user[list].includes(bookId)) {
      return res.status(400).json({
        message: "Le livre n'est pas présent dans la liste",
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
  } catch (error) {
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

/**
 * Ajoute un livre à la liste de lecture sélectionné dans "listparam" pour l'utilisateur connecté.
 *
 * @param {CustomRequest} req - La requête, contenant la clé de la liste de lecture et l'ID du livre à ajouter.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si le livre a été ajouté à la liste.
 */
export const addToBooksLists = async (req: CustomRequest, res: Response) => {
  const listParam = req.params.list;

  if (!isBookListKey(listParam)) {
    return res.status(400).json({ message: "Invalid book list key" });
  }

  const list: BookListKey = listParam;

  const bookId = req.body.bookId;
  const id = req.user.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (user[list].includes(bookId)) {
      return res
        .status(400)
        .json({ message: "Livre déjà présent dans la liste" });
    }

    user[list].push(bookId);

    user.save();

    return res.status(200).json({ message: "Livre ajouté à la liste" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est prosuite" });
  }
};

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
export const getUser = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

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
export const updateProfilePicture = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        res.status(400).send({ message: "Une erreur s'est produite" });
      } else if (err) {
        res.status(400).send({ message: "Une erreur s'est produite" });
      } else {
        if (!req.file) {
          res.status(400).send({ message: "Aucun fichier sélectionné." });
        } else {
          res.status(200).send({
            message: "Photo de profil téléchargée avec succès.",
            file: req.file,
          });
        }
      }
    });
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    user.profilePicturePath = `./src/uploads/${req.file.filename}`;

    user.save();
  } catch (error) {
    res.status(500).send({ message: "Une erreur s'est produite" });
  }
};

/**
 * Supprime la photo de profil d'un utilisateur et change la route vers l'image par défaut.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'ID de l'utilisateur.
 * @param {Response} res - La réponse HTTP à renvoyer.
 * @returns {Promise<Response>} Une réponse HTTP avec un message indiquant si la photo de profil a été supprimée ou non.
 * @throws {Error} Si une erreur se produit lors de la suppression de la photo de profil.
 */
export const deleteProfilePicture = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    const filename = user.profilePicturePath;

    fs.unlink(filename, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression du fichier" });
      }

      res.status(200).json({ message: "Fichier supprimé avec succès" });
    });

    user.profilePicturePath = "./src/uploads/default-picture.png";

    user.save();

    return res
      .status(200)
      .json({ message: "La photo de profil a bien été supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

/**
 * Envoie une demande de contact à un autre utilisateur.
 *
 * @param {CustomRequest} req - La requête, contenant l'ID de l'utilisateur connecté et l'ID de l'utilisateur à qui envoyer la demande.
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant si la demande de contact a été envoyée.
 */
export const requestContact = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.user.id;
    const idUserRequested = req.params.idUserRequested;

    const userRequested = await User.findById(idUserRequested);

    if (userRequested.listRequestContacts.includes(id)) {
      return res.status(400).json({
        message: "Une demande de contact à déjà été envoyé à cet utilisateur",
      });
    }
    userRequested.listRequestContacts.push(id);

    userRequested.save();

    return res.json({ message: "La demande de contact a bien été envoyée" });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Un des deux utilisateurs n'existe pas" });
  }
};

/**
 * Traite la réponse à une demande de contact.
 *
 * @param {CustomRequest} req - La requête contenant l'ID de l'utilisateur qui répond à la demande,
 * l'ID de l'utilisateur qui a envoyé la demande et la réponse ('accept' ou 'decline').
 * @param {Response} res - La réponse, renvoyant un message de succès ou d'erreur.
 * @returns {Promise<Response>} Une réponse avec un message indiquant que la réponse a bien été renvoyé.
 */
export const responseRequestContact = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    const response = req.body.response;

    const idUserSentRequest: string = req.body.idUserSentRequest;
    const userSentRequest = await User.findById(idUserSentRequest);

    if (!user || !userSentRequest) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }
    const newListRequestContact = user.listRequestContacts.filter((id) => {
      return id !== idUserSentRequest;
    });

    if (user.listContacts.includes(idUserSentRequest)) {
      return res.status(400).json({
        message: "L'utilisateur est déjà présent da la liste des contacts",
      });
    }

    if (response === "accept") {
      user.listContacts.push(idUserSentRequest);
      userSentRequest.listContacts.push(id);
    }

    user.listRequestContacts = newListRequestContact;

    user.save();
    userSentRequest.save();

    return res.status(200).json({ message: "La réponse a bien été envoyé" });
  } catch (error) {
    return res.status(500).json({
      message:
        "Une erreur s'est produite lors de la réponse à la demande de contact",
    });
  }
};

/**
 * Supprime de la liste des contacts de deux utilisateurs.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'ID de l'utilisateur et l'ID du contact à supprimer.
 * @param {Response} res - La réponse HTTP à renvoyer.
 * @returns {Promise<Response>} Une réponse HTTP avec un message indiquant que le contact a été supprimé.
 * @throws {Error} Si une erreur se produit lors de la suppression du contact.
 */
export const deleteContact = async (req: CustomRequest, res: Response) => {
  const idUser = req.user.id;
  const user = await User.findById(idUser);

  const idUserToDelete = req.params.idUserToDelete;
  const userToDelete = await User.findById(idUserToDelete);

  if (!user || !userToDelete) {
    return res.status(404).json({ message: "L'utilisateur n'existe pas" });
  }

  const newListContactsUser = user.listContacts.filter((id) => {
    return id.toString() !== idUserToDelete;
  });
  const newListContactsUserToDelete = userToDelete.listContacts.filter((id) => {
    return id.toString() !== idUser;
  });

  try {
    user.listContacts = newListContactsUser;
    userToDelete.listContacts = newListContactsUserToDelete;

    user.save();
    userToDelete.save();

    return res.status(200).json({ message: "Le contact a bien été supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du contact :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du contact" });
  }
};

/**
 * Récupère les 10 premiers utilisateurs de la collection 'users'
 * en incluant uniquement les champs 'pseudo' et 'profilePicturePath'.
 *
 * @returns {Promise<Array<Object>>} Un tableau contenant les 10 premiers utilisateurs
 * @throws {Error} Si une erreur se produit lors de la récupération des utilisateurs
 */
export const getPropositionContacts = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find()
      .select("pseudo profilePicturePath")
      .limit(10)
      .exec();

    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json("Erreur lors de la récupération des utilisateurs");
  }
};

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route utilisateur ok" });
};
/////////////////////////////////////////////////////////////

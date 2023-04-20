import { BookListKey, User } from "../models/user.model";
import { Request, Response } from "express";

import multer from "multer";
import fs from "fs";

import { upload } from "../config/multer.config";

import { UserWithBookLists } from "../models/user.model";

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

export const deleteFromBooksLists = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const listParam = req.params.list;

    if (!isBookListKey(listParam)) {
      return res.status(400).json({ message: "Invalid book list key" });
    }

    const list: BookListKey = listParam;

    const bookId = req.body.bookId;
    const id = req.user.id;
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

export const addToBooksLists = async (req: CustomRequest, res: Response) => {
  try {
    const listParam = req.params.list;

    if (!isBookListKey(listParam)) {
      return res.status(400).json({ message: "Invalid book list key" });
    }

    const list: BookListKey = listParam;

    const bookId = req.body.bookId;
    const id = req.user.id;
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
    return res.status(200).json({ message: "Photo de profil supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

export const requestContact = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.user.id;
    const idUserRequested = req.params.idUserRequested;

    const users = await User.find({
      _id: {
        $in: [id, idUserRequested],
      },
    });

    const user = users.find((user) => user._id.toString() === id);
    const userRequested = users.find(
      (user) => user._id.toString() === idUserRequested
    );

    // vérifier su "id" n'est pas déjà présent dans "userRequested.listRequestContacts"
    if (userRequested.listRequestContacts.includes(id)) {
      return res.status(400).json({
        message: "Une demande de contact à déjà été envoyé à cet utilisateur",
      });
    }
    userRequested.listRequestContacts.push(id);

    userRequested.save();

    return res.json(user);
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Un des deux utilisateurs n'existe pas" });
  }
};

export const responseRequestContact = async (
  req: CustomRequest,
  res: Response
) => {
  const id = req.user.id;
  const user = await User.findById(id);

  const response = req.body.response;

  const idUserSentRequest: string = req.body.idUserSentRequest;

  const newRequestContactList = user.listRequestContacts.filter((id) => {
    return id !== idUserSentRequest;
  });

  if (user.listContacts.includes(idUserSentRequest)) {
    return res.json({
      message: "L'utilisateur est déjà présent da la liste des contacts",
    });
  }

  if (response === "accept") {
    user.listContacts.push(idUserSentRequest);
  }

  user.listRequestContacts = newRequestContactList;

  user.save();

  return res.status(200).json({ message: "La réponse a bien été envoyé" });
};

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route utilisateur ok" });
};
/////////////////////////////////////////////////////////////

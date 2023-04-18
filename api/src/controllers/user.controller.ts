import { User } from "../models/user.model";
import { Request, Response } from "express";

import multer from "multer";
import fs from "fs";

import { upload } from "../config/multer.config";

interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}

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
    res.status(500).json({ message: "Error retrieving user", error });
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
        res.status(400).send({ message: err });
      } else if (err) {
        res.status(400).send({ message: err.message });
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
    res.status(500).send({ message: error });
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
        console.error(err);
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
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const addBookToFavoritesList = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    // vérifier si le livre est présent en bdd

    if (user.listFavoritesBooks.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "Livre déjà présent dans la liste des favoris" });
    }

    user.listFavoritesBooks.push(bookId);

    user.save();
    return res
      .status(200)
      .json({ message: "Livre ajouté à la liste des favoris" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const deleteBookFromFavoritesList = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (!user.listFavoritesBooks.includes(bookId)) {
      return res.status(400).json({
        message: "Le livre n'est pas présent dans la liste des favoris",
      });
    }

    let newFavoriteList = user.listFavoritesBooks.filter((id) => {
      return id !== bookId;
    });

    user.listFavoritesBooks = newFavoriteList;

    user.save();
    return res
      .status(200)
      .json({ message: "Livre supprimé de la liste des favoris" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const addBookToReadList = async (req: CustomRequest, res: Response) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (user.listBooksAlreadyRead.includes(bookId)) {
      return res
        .status(400)
        .json({
          message: "Livre déjà présent dans la liste des livres à lire",
        });
    }

    user.listBooksAlreadyRead.push(bookId);

    user.save();
    return res
      .status(200)
      .json({ message: "Livre ajouté à la liste des livres à lire" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const deleteBookFomReadList = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (!user.listBooksAlreadyRead.includes(bookId)) {
      return res.status(400).json({
        message: "Le livre n'est pas présent dans la liste des livres à lire",
      });
    }

    let newFavoriteList = user.listBooksAlreadyRead.filter((id) => {
      return id !== bookId;
    });

    user.listBooksAlreadyRead = newFavoriteList;

    user.save();
    return res
      .status(200)
      .json({ message: "Livre supprimé de la liste des livres à lire" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const addBookToWishList = async (req: CustomRequest, res: Response) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (user.listWishBooks.includes(bookId)) {
      return res
        .status(400)
        .json({
          message: "Livre déjà présent dans la liste des livres voulus",
        });
    }

    user.listWishBooks.push(bookId);

    user.save();
    return res
      .status(200)
      .json({ message: "Livre ajouté à la liste des livres voulus" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const deleteBookToWishList = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const bookId = req.body.bookId;
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    if (!user.listWishBooks.includes(bookId)) {
      return res.status(400).json({
        message: "Le livre n'est pas présent dans la liste des livres voulus",
      });
    }

    let newFavoriteList = user.listWishBooks.filter((id) => {
      return id !== bookId;
    });

    user.listWishBooks = newFavoriteList;

    user.save();
    return res
      .status(200)
      .json({ message: "Livre supprimé de la liste des livres voulus" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user", error });
  }
};

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route utilisateur ok" });
};
/////////////////////////////////////////////////////////////

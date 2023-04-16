import { User, IUser } from "../models/user.model";
import { Request, Response } from "express";

import multer from "multer";
import fs from "fs";

import { upload } from "../config/multer.config";

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
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
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
export const updateProfilePicture = async (req: Request, res: Response) => {
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
            message: "Image de profil téléchargée avec succès.",
            file: req.file,
          });
        }
      }
    });
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    user.profilePicturePath = `./src/uploads/${req.file.filename}`;

    user.save();
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // if (user.profilePicturePath === "./src/uploads/default-picture.png") {
    //   return res.status(400).json({
    //     message: "L'utilisateur n'a pas de photo de profile à supprimer",
    //   });
    // }
    const filename = user.profilePicturePath;

    // return res.send({ filename });
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

/////////////////////////////////////////////////////////////
export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route utilisateur ok" });
};
/////////////////////////////////////////////////////////////

import { Request, Response } from "express";
import { Book, IBook } from "../models/book.model";
import { User } from "../models/user.model";

interface CustomRequest extends Request {
  user: {
    id: string;
    email: string;
    newAccessToken: string | null;
  };
}

/**
 * Ajoute des livres à la base de données à partir d'un tableau d'objets.
 * N'ajoute pas les livres si l'idApi est déjà présent en base de données.
 *
 * @param {Request} req - La requête HTTP contenant le tableau d'objets de livres dans req.body.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un message et un statut appropriés.
 */
export const addBooks = async (req: Request, res: Response) => {
  try {
    const booksArray = req.body;

    const newBooks: IBook[] = [];

    for (const bookData of booksArray) {
      const { title, coverPicture, author, date, summary, idApi } = bookData;

      const existingBook = await Book.findOne({ idApi });

      if (!existingBook) {
        const newBook: IBook = new Book({
          idApi,
          coverPicture,
          title,
          author,
          date,
          summary,
        });

        newBooks.push(newBook);
      }
    }

    if (newBooks.length > 0) {
      await Book.insertMany(newBooks);

      return res.status(201).json({
        message: "Les livres ont bien été ajoutés à la base de données",
      });
    } else {
      return res.status(203).json({
        message: "Aucun nouveaux livres à ajouter à la base de données",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Récupère un livre de la base de données en utilisant l'idApi fourni dans les paramètres de la requête.
 *
 * @param {Request} req - La requête HTTP contenant l'idApi du livre dans req.params.id.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un statut 200 et le livre trouvé, ou un statut 404 si le livre n'est pas trouvé.
 */
export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findOne({ idApi: req.params.id });

    if (book) {
      return res.status(200).json(book);
    } else {
      return res
        .status(404)
        .json({ message: "Le livre n'est pas présent en base de données" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

/**
 * Ajoute un commentaire à un livre en utilisant l'idApi du livre et les informations de l'utilisateur authentifié.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'idApi du livre dans req.params.id, les informations de l'utilisateur authentifié et les données du commentaire dans req.body.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un statut 200 et un message 'ok', ou un statut d'erreur approprié avec un message d'erreur.
 */
export const addComment = async (req: CustomRequest, res: Response) => {
  try {
    const { userPseudo, userPicture, message, date } = req.body;

    const user = await User.findById(req.user.id);
    const book = await Book.findOne({ idApi: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre n'est pas présent en base de données" });
    }

    book.listComments.push({
      userPseudo,
      userPicture,
      message,
      date, // renvoyer la date UTC depuis le front
    });

    await book.save();

    return res.status(200).json("Le commentaire a bien été ajouté");
  } catch (error) {
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

/**
 * Ajoute une note à un livre pour l'utilisateur connecté.
 * @param req - La requête, contenant l'ID du livre en tant que paramètre d'URL, l'ID de l'utilisateur dans req.user.id et la note dans req.body.rating.
 * @param res - La réponse, indiquant si la note a été ajoutée avec succès ou si une erreur s'est produite.
 * @return {Response} - Une réponse JSON indiquant si la note a été ajoutée avec succès, si l'utilisateur a déjà noté ce livre, si le livre n'est pas présent en base de données, ou si une erreur s'est produite.
 */
export const addRating = async (req: CustomRequest, res: Response) => {
  try {
    const book = await Book.findOne({ idApi: req.params.id });

    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre n'est pas présent en base de données" });
    }

    // si j'ai le temps, donner la possibilitée de modifier la note
    const alreadyRated = book.listRatings.find(
      (item) => item.userId === req.user.id
    );

    if (alreadyRated) {
      return res.status(400).json("L'utilisateur a déjà noté ce livre");
    }

    book.listRatings.push({
      userId: req.user.id,
      rating: req.body.rating,
    });

    await book.save();

    return res.status(200).json("La note a bien été ajouté");
  } catch (error) {
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

/**
 * Récupère la note moyenne d'un livre en fonction de son idApi.
 * @param req - La requête, contenant l'ID du livre en tant que paramètre d'URL.
 * @param res - La réponse, contenant la note moyenne du livre.
 * @return {Response} - Une réponse JSON contenant la note moyenne du livre, ou un message d'erreur si le livre n'est pas trouvé ou si une erreur s'est produite.
 */
export const getRating = async (req: CustomRequest, res: Response) => {
  try {
    const book = await Book.findOne({ idApi: req.params.id });
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre n'est pas présent en base de données" });
    }

    const ratings = book.listRatings;
    const arrayRatingsLength = ratings.length;

    if (arrayRatingsLength === 0) {
      // ne pas afficher que le livre est noté 0 mais plutôt qu'il n'a pas encore de note
      return res.status(200).json({ average: 0 });
    }

    let sum: number = 0;
    for (const item of ratings) {
      sum += Number(item.rating);
    }

    const average = (sum / arrayRatingsLength).toFixed(1);

    return res.status(200).json({ average: Number(average) });
  } catch (error) {
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

export const test = (req: Request, res: Response) => {
  return res.status(201).json({ message: "route livre ok" });
};

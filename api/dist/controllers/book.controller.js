"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleBook = exports.getRating = exports.addRating = exports.addComment = exports.getBook = exports.addBooks = void 0;
const book_model_1 = require("../models/book.model");
const user_model_1 = require("../models/user.model");
/**
 * Ajoute des livres à la base de données à partir d'un tableau d'objets.
 * N'ajoute pas les livres si l'idApi est déjà présent en base de données.
 *
 * @param {Request} req - La requête HTTP contenant le tableau d'objets de livres dans req.body.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un message et un statut appropriés.
 */
const addBooks = async (req, res) => {
    try {
        const booksArray = req.body;
        const newBooks = [];
        for (const bookData of booksArray) {
            const { title, coverPicture, author, date, summary, idApi } = bookData;
            const existingBook = await book_model_1.Book.findOne({ idApi });
            if (!existingBook) {
                const newBook = new book_model_1.Book({
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
            await book_model_1.Book.insertMany(newBooks);
            return res.status(201).json({
                message: "Les livres ont bien été ajoutés à la base de données",
            });
        }
        else {
            return res.status(203).json({
                message: "Aucun nouveaux livres à ajouter à la base de données",
            });
        }
    }
    catch (error) {
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.addBooks = addBooks;
/**
 * Récupère un livre de la base de données en utilisant l'idApi fourni dans les paramètres de la requête.
 *
 * @param {Request} req - La requête HTTP contenant l'idApi du livre dans req.params.id.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un statut 200 et le livre trouvé, ou un statut 404 si le livre n'est pas trouvé.
 */
const getBook = async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ idApi: req.params.id });
        if (book) {
            return res.status(200).json(book);
        }
        else {
            return res
                .status(404)
                .json({ erreur: "Le livre n'est pas présent en base de données" });
        }
    }
    catch (error) {
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.getBook = getBook;
/**
 * Ajoute un commentaire à un livre en utilisant l'idApi du livre et les informations de l'utilisateur authentifié.
 *
 * @param {CustomRequest} req - La requête HTTP contenant l'idApi du livre dans req.params.id, les informations de l'utilisateur authentifié et les données du commentaire dans req.body.
 * @param {Response} res - L'objet de réponse HTTP à envoyer au client.
 * @returns {Response} - Renvoie une réponse HTTP avec un statut 200 et un message 'ok', ou un statut d'erreur approprié avec un message d'erreur.
 */
const addComment = async (req, res) => {
    try {
        const { userPseudo, userPicture, message, date } = req.body;
        const user = await user_model_1.User.findById(req.user.id);
        const book = await book_model_1.Book.findOne({ idApi: req.params.id });
        if (!user) {
            return res.status(404).json({ erreur: "L'utilisateur n'existe pas" });
        }
        if (!book) {
            return res
                .status(404)
                .json({ erreur: "Le livre n'est pas présent en base de données" });
        }
        book.listComments.push({
            userPseudo,
            userPicture,
            message,
            date, // renvoyer la date UTC depuis le front
        });
        await book.save();
        return res.status(200).json(book.listComments);
    }
    catch (error) {
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.addComment = addComment;
/**
 * Ajoute une note à un livre pour l'utilisateur connecté.
 * @param req - La requête, contenant l'ID du livre en tant que paramètre d'URL, l'ID de l'utilisateur dans req.user.id et la note dans req.body.rating.
 * @param res - La réponse, indiquant si la note a été ajoutée avec succès ou si une erreur s'est produite.
 * @return {Response} - Une réponse JSON indiquant si la note a été ajoutée avec succès, si l'utilisateur a déjà noté ce livre, si le livre n'est pas présent en base de données, ou si une erreur s'est produite.
 */
const addRating = async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ idApi: req.params.id });
        if (!book) {
            return res
                .status(404)
                .json({ erreur: "Le livre n'est pas présent en base de données" });
        }
        // si j'ai le temps, donner la possibilitée de modifier la note
        const alreadyRated = book.listRatings.find((item) => item.userId === req.user.id);
        if (alreadyRated) {
            return res
                .status(400)
                .json({ erreur: "L'utilisateur a déjà noté ce livre" });
        }
        book.listRatings.push({
            userId: req.user.id,
            rating: req.body.rating,
        });
        await book.save();
        return res.status(200).json("La note a bien été ajouté");
    }
    catch (error) {
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.addRating = addRating;
/**
 * Récupère la note moyenne d'un livre en fonction de son idApi.
 * @param req - La requête, contenant l'ID du livre en tant que paramètre d'URL.
 * @param res - La réponse, contenant la note moyenne du livre.
 * @return {Response} - Une réponse JSON contenant la note moyenne du livre, ou un message d'erreur si le livre n'est pas trouvé ou si une erreur s'est produite.
 */
const getRating = async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ idApi: req.params.id });
        if (!book) {
            return res
                .status(404)
                .json({ erreur: "Le livre n'est pas présent en base de données" });
        }
        const ratings = book.listRatings;
        const arrayRatingsLength = ratings.length;
        if (arrayRatingsLength === 0) {
            // ne pas afficher que le livre est noté 0 mais plutôt qu'il n'a pas encore de note
            return res.status(200).json({ average: 0 });
        }
        let sum = 0;
        for (const item of ratings) {
            sum += Number(item.rating);
        }
        const average = (sum / arrayRatingsLength).toFixed(1);
        return res.status(200).json({ average: Number(average) });
    }
    catch (error) {
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.getRating = getRating;
const fetchGoogleBook = async (req, res) => {
    try {
        const query = req.body.query;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}&key=${process.env.GOOGLE_API_KEY}`);
        const allBooks = await book_model_1.Book.find({}, { idApi: 1, _id: 0 });
        const idApiValues = allBooks ? allBooks.map((book) => book.idApi) : [];
        const listApiBooks = await response.json();
        const newArray = listApiBooks?.items.map((book) => {
            book.idApi = book.id;
            book.author = book.volumeInfo.authors[0];
            book.summary = book.volumeInfo.description;
            book.category = book.volumeInfo.categories
                ? book.volumeInfo.categories[0]
                : "";
            if (book.volumeInfo.imageLinks) {
                if (book.volumeInfo.imageLinks.thumbnail) {
                    book.imageLinks = book.volumeInfo.imageLinks.thumbnail;
                }
                else if (book.volumeInfo.imageLinks.smallThumbnail) {
                    book.imageLinks = book.volumeInfo.imageLinks.smallThumbnail;
                }
                else {
                    book.imageLinks = "";
                }
            }
            else {
                book.imageLinks = "";
            }
            book.title = book.volumeInfo.title;
            book.publishedDate = book.volumeInfo.publishedDate;
            book.publisher = book.volumeInfo.publisher;
            book.isbn = book.volumeInfo.industryIdentifiers[1]
                ? book.volumeInfo.industryIdentifiers[1].identifier
                : book.volumeInfo.industryIdentifiers[0].identifier;
            book.listComments = [];
            book.listRatings = [];
            delete book.id;
            delete book.kind;
            delete book.accessInfo;
            delete book.etag;
            delete book.saleInfo;
            delete book.searchInfo;
            delete book.selfLink;
            delete book.volumeInfo;
            if (!idApiValues.includes(book.idApi)) {
                (async () => {
                    await book_model_1.Book.create(book);
                })();
            }
            return book;
        });
        return res.status(200).json(newArray);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ erreur: "Une erreur s'est produite" });
    }
};
exports.fetchGoogleBook = fetchGoogleBook;
//# sourceMappingURL=book.controller.js.map
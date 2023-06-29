"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
    idApi: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String },
    category: { type: String },
    imageLinks: { type: String },
    title: { type: String, required: true },
    publishedDate: { type: Date },
    publisher: { type: String },
    isbn: { type: String },
    listComments: {
        type: [
            {
                userPseudo: { type: String, required: true },
                userPicture: { type: String, required: true },
                message: { type: String, required: true },
                date: { type: Date, required: true },
            },
        ],
        default: [],
    },
    listRatings: {
        type: [
            {
                userId: { type: String, required: true },
                rating: { type: Number, required: true, min: 1, max: 5 },
            },
        ],
        default: [],
    },
});
exports.Book = (0, mongoose_1.model)("Book", BookSchema);
//# sourceMappingURL=book.model.js.map
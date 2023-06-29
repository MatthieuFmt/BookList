"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const router = express_1.default.Router();
router.post("/add-books", book_controller_1.addBooks);
router.get("/get-book/:id", book_controller_1.getBook);
router.post("/add-comment/:id", book_controller_1.addComment);
router.post("/add-rating/:id", book_controller_1.addRating);
router.get("/get-rating/:id", book_controller_1.getRating);
router.post("/fetch-googlebook", book_controller_1.fetchGoogleBook);
exports.default = router;
//# sourceMappingURL=book.routes.js.map
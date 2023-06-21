import express from "express";
import {
  addBooks,
  getBook,
  addComment,
  addRating,
  getRating,
  fetchGoogleBook,
} from "../controllers/book.controller";

const router = express.Router();

router.post("/add-books", addBooks);
router.get("/get-book/:id", getBook);
router.post("/add-comment/:id", addComment);
router.post("/add-rating/:id", addRating);
router.get("/get-rating/:id", getRating);
router.post("/fetch-googlebook", fetchGoogleBook);

export default router;

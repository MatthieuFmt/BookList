import express from "express";
import {
  test,
  addBooks,
  getBook,
  addComment,
  addRating,
  getRating,
} from "../controllers/book.controller";

const router = express.Router();

router.post("/add-books", addBooks);
router.get("/get-book/:id", getBook);
router.post("/add-comment/:id", addComment);
router.post("/add-rating/:id", addRating);
router.post("/get-rating/:id", getRating);

router.get("/", test);

export default router;

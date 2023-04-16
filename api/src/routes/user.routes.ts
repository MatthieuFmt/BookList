import express, { Request, Response } from "express";
import {
  test,
  getUser,
  updateProfilePicture,
  deleteProfilePicture,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/get-user/:id", getUser);
router.post("/upload-profile-picture/:id", updateProfilePicture);
router.get("/delete-profile-picture/:id", deleteProfilePicture);

// router.post("/add-to-favorite", addBookToFavrite);
// router.delete("/delete-to-favorite", deleteBookToFavrite);

// router.post("/add-to-already-read-list", addBookToAlreadyReadList);
// router.delete("/delete-from-already-read-list", deleteBookFomAlreadyReadList);

// router.post("/add-to-read-list", addBookToReadList);
// router.delete("/delete-to-read-list", deleteBookToReadList);

// router.post("/add-contact", addContact);
// router.delete("/delete-contact", deleteContact);

// router.post("/forgot-password", forgotPassword);

router.get("/", test);

export default router;

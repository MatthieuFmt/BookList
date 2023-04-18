import express from "express";
import {
  test,
  getUser,
  updateProfilePicture,
  deleteProfilePicture,
  addBookToFavoritesList,
  deleteBookFromFavoritesList,
  addBookToReadList,
  deleteBookFomReadList,
  addBookToWishList,
  deleteBookToWishList,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/get-user", getUser);
router.post("/update-profile-picture", updateProfilePicture);
router.delete("/delete-profile-picture", deleteProfilePicture);

router.post("/add-to-favorites-list", addBookToFavoritesList);
router.delete("/delete-from-favorites-list", deleteBookFromFavoritesList);

router.post("/add-to-already-read-list", addBookToReadList);
router.delete("/delete-from-already-read-list", deleteBookFomReadList);

router.post("/add-to-wish-list", addBookToWishList);
router.delete("/delete-from-wish-list", deleteBookToWishList);

// router.post("/add-contact", addContact);
// router.delete("/delete-contact", deleteContact);

// router.post("/forgot-password", forgotPassword);

router.get("/", test);

export default router;

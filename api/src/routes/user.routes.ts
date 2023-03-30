import express from "express";
import { createUser, test } from "../controllers/user.controller";

const router = express.Router();

router.post("/create", createUser);
// router.post("/connect", connectUser);
// router.post("/forgot-password", forgotPassword);
// router.post("/deconnect", deconnectUser);
// router.get("/get-infos/:id", getInfos);
// router.post("/update-image", updateImage);
// router.post("/add-to-favorite", addBookToFavrite);
// router.delete("/delete-to-favorite", deleteBookToFavrite);
// router.post("/add-to-already-read-list", addBookToAlreadyReadList);
// router.delete("/delete-from-already-read-list", deleteBookFomAlreadyReadList);
// router.post("/add-to-read-list", addBookToReadList);
// router.delete("/delete-to-read-list", deleteBookToReadList);
// router.post("/add-contact", addContact);
// router.delete("/delete-contact", deleteContact);
router.get("/", test);

export default router;

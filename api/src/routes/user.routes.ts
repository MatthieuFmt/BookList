import express from "express";
import {
  test,
  getUser,
  updateProfilePicture,
  deleteProfilePicture,
  deleteFromBooksLists,
  addToBooksLists,
  requestContact,
  responseRequestContact,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/get-user", getUser);
router.post("/update-profile-picture", updateProfilePicture);
router.delete("/delete-profile-picture", deleteProfilePicture);

router.post("/add-to-lists/:list", addToBooksLists);
router.delete("/delete-from-lists/:list", deleteFromBooksLists);

router.get("/request-contact/:idUserRequested", requestContact);
router.post("/response-request-contact", responseRequestContact);
// router.delete("/delete-contact", deleteContact);

// router.get("/get-proposition-users", getPropositionUsers);

router.get("/", test);

export default router;

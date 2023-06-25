import express from "express";

import {
  getUsers,
  getList,
  updateProfilePicture,
  deleteProfilePicture,
  deleteFromBooksLists,
  addToBooksLists,
  requestContact,
  responseRequestContact,
  deleteContact,
  getPropositionContacts,
  getConnectedUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/get-connected-user", getConnectedUser);

router.post("/get-users", getUsers);

router.get("/get-list/:list", getList);

router.post("/update-profile-picture", updateProfilePicture);
router.delete("/delete-profile-picture", deleteProfilePicture);

router.post("/add-to-lists/:list", addToBooksLists);
router.delete("/delete-from-lists/:list", deleteFromBooksLists);

router.get("/request-contact/:idUserRequested", requestContact);
router.post("/response-request-contact", responseRequestContact);
router.delete("/delete-contact/:idUserToDelete", deleteContact);

router.get("/get-proposition-contacts", getPropositionContacts);

export default router;

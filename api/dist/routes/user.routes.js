"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/get-connected-user", user_controller_1.getConnectedUser);
router.post("/get-users", user_controller_1.getUsers);
router.post("/get-users-to-exchange", user_controller_1.getUsersToExchange);
router.get("/get-list/:list", user_controller_1.getList);
router.post("/update-profile-picture", user_controller_1.updateProfilePicture);
router.delete("/delete-profile-picture", user_controller_1.deleteProfilePicture);
router.post("/add-to-lists/:list", user_controller_1.addToBooksLists);
router.delete("/delete-from-lists/:list", user_controller_1.deleteFromBooksLists);
router.get("/request-contact/:idUserRequested", user_controller_1.requestContact);
router.post("/response-request-contact", user_controller_1.responseRequestContact);
router.delete("/delete-contact/:idUserToDelete", user_controller_1.deleteContact);
router.get("/get-proposition-contacts", user_controller_1.getPropositionContacts);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
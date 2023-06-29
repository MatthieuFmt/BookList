"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.createUser);
router.post("/connect", auth_controller_1.connectUser);
router.post("/disconnect", auth_controller_1.disconnectUser);
router.post("/refresh-token", auth_controller_1.refreshToken);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password/:token", auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
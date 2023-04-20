import express from "express";
import {
  createUser,
  connectUser,
  disconnectUser,
  test,
  refreshToken,
  forgotPassword,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", createUser);
router.post("/connect", connectUser);
router.post("/disconnect", disconnectUser);
router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPassword);

router.get("/", test);

export default router;

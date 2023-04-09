import express from "express";
import {
  createUser,
  connectUser,
  disconnectUser,
  test,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", createUser);
router.post("/connect", connectUser);
router.post("/disconnect", disconnectUser);

router.get("/", test);

export default router;

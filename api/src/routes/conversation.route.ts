import express from "express";
import { test, getInfos } from "../controllers/conversation.controller";

const router = express.Router();

// router.post("/create", create);
// router.post("/add-message", addMessage);
// router.post("/add-opinion", addOpinion);
router.get("/get-infos/:id", getInfos);
router.get("/", test);

export default router;

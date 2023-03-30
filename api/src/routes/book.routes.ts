import express from "express";
import { test } from "../controllers/book.controller";

const router = express.Router();

// router.post("/create", create);
// router.get("/get-infos/:id", getInfos);
// router.post("/add-message", addMessage);
// router.post("/add-opinion", addOpinion);
router.get("/", test);

export default router;

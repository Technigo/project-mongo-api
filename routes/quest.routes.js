import express from "express";
import { getQuests, createQuest } from "../controllers/quest.controller.js";

const router = express.Router();

router.get("/", getQuests);
router.post("/", createQuest);

export { router as questRoutes };

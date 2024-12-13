import express from "express";
import { getWorlds, createWorld } from "../controllers/world.controller.js";

const router = express.Router();

router.get("/", getWorlds);
router.post("/", createWorld);

export { router as worldRoutes };

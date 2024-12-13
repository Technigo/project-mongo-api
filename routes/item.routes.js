import express from "express";
import { getItems, createItem } from "../controllers/item.controller.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);

export { router as itemRoutes };

import express from "express";
import {
  validateCharacter,
  handleValidationErrors,
} from "../middleware/validate.characters.js";
import {
  getCharacters,
  createCharacter,
} from "../controllers/character.controller.js";

const router = express.Router();

router.get("/", getCharacters);
router.post("/", validateCharacter, handleValidationErrors, createCharacter);

export { router as characterRoutes };

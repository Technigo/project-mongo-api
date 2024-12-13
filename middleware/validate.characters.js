// Import necessary functions from express-validator
import { body, validationResult } from "express-validator";
import { Character } from "../models/character.model";

// Validation rules for creating a character
export const validateCharacter = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string.")
    .custom(async (name) => {
      const existingCharacter = await Character.findOne({ name });
      if (existingCharacter) {
        throw new Error("Character with this name already exists.");
      }
      return true;
    }),
  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isString()
    .withMessage("Role must be a string."),

  body("homeWorld")
    .notEmpty()
    .withMessage("HomeWorld is required.")
    .isMongoId()
    .withMessage("HomeWorld must be a valid ObjectId."),

  body("quests")
    .optional() // Quests are optional
    .isArray()
    .withMessage("Quests must be an array.")
    .custom((quests) => {
      if (quests.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("All quests must be valid ObjectIds.");
      }
      return true;
    }),

  body("item")
    .optional() // Item is optional
    .isMongoId()
    .withMessage("Item must be a valid ObjectId."),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

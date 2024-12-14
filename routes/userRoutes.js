import express from "express";
import { getUsers, createUser, updateUser } from "../controllers/userController.js";
import { validateUser, validate } from "../middleware/validation.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST a new user with validation
router.post("/", validateUser, validate, createUser);

// PUT (update) an existing user with validation
router.put("/:id", validateUser, validate, updateUser);

export { router as userRoutes };

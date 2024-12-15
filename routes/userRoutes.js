import express from "express";
import { getUsers, getUserById, createUser, updateUser } from "../controllers/userController.js";
import { validateUser, validate } from "../middleware/validation.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a specific user by ID
router.get("/:id", getUserById);

// POST a new user with validation
router.post("/", validateUser, validate, createUser);

// PUT (update) an existing user with validation
router.put("/:id", validateUser, validate, updateUser);

export { router as userRoutes };

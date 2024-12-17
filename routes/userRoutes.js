import express from "express";
import { getUsers, getUserById, createUser, updateUser, updateUserPut } from "../controllers/userController.js";
import { validateUserCreate, validateUserUpdate, validate } from "../middleware/validation.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET a specific user by ID
router.get("/:id", getUserById);

// POST a new user with validation
router.post("/", validateUserCreate, validate, createUser);

// PUT (update) an existing user with validation
router.put("/:id", validateUserUpdate, validate, updateUserPut);

// PATCH (partial update an existing user)
router.patch("/:id", validateUserUpdate, validate, updateUser);

export { router as userRoutes };

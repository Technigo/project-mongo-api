import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// POST a new user
router.post("/", createUser);

// PUT (update) an existing user
router.put("/:id", updateUser);

export default router;

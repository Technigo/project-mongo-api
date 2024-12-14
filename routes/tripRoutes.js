import express from "express";
import { getTrips, createTrip, updateTrip } from "../controllers/tripController.js";
import { validateTrip, validate } from "../middleware/validation.js";

const router = express.Router();

// GET all trips
router.get("/", getTrips);

// POST a new trip with validation
router.post("/", validateTrip, validate, createTrip);

// PUT (update) an existing trip with validation
router.put("/:id", validateTrip, validate, updateTrip);

export { router as tripRoutes };

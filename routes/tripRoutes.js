import express from "express";
import { getTrips, getTripById, createTrip, updateTrip, updateTripPut } from "../controllers/tripController.js";
import { validateTripCreate, validateTripUpdate, validate } from "../middleware/validation.js";

const router = express.Router();

// GET all trips
router.get("/", getTrips);

// GET a specific trip by ID
router.get("/:id", getTripById);

// POST a new trip with validation
router.post("/", validateTripCreate, validate, createTrip);

// PUT (update) an existing trip with validation
router.put("/:id", validateTripUpdate, validate, updateTripPut);

// PATCH (partial update an existing trip)
router.patch("/:id", validateTripUpdate, validate, updateTrip);

export { router as tripRoutes };

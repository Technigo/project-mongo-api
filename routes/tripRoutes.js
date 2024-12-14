import express from "express";
import {
  getTrips,
  createTrip,
  updateTrip,
} from "../controllers/tripController.js";

const router = express.Router();

// GET all trips
router.get("/", getTrips);

// POST a new trip
router.post("/", createTrip);

// PUT (update) an existing trip
router.put("/:id", updateTrip);

export default router;

// Import necessary modules.
import express from "express";
import listEndpoints from "express-list-endpoints";
import { NetflixShowModel } from "../models/NetflixShow";

// Create an Express router.
const router = express.Router();

// Endpoint "/" to return documentation of API using Express List Endpoints.
router.get("/", (req, res) => {
  // List all endpoints registered with the router.
  const endpoints = listEndpoints(router);
  res.json({ endpoints });
});

// Show all data.
router.get("/netflix-shows", async (req, res) => {
  try {
    const result = await NetflixShowModel.find();
    res.json(result);
  } catch (error) {
    console.error(error.stack); // Log the error for debugging if needed
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the route to find a show by show_id.
router.get("/netflix-show/:show_id", async (req, res) => {
  const { show_id } = req.params;

  try {
    const netflixShowID = await NetflixShowModel.findOne({
      show_id: Number(show_id),
    });

    if (netflixShowID) {
      res.json(netflixShowID);
    } else {
      res.status(404).json({ error: "Netflix show not found, try another id" });
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the route to find shows by type.
router.get("/netflix-shows/type/:type", async (req, res) => {
  const type = req.params.type.toLowerCase();

  try {
    const showType = await NetflixShowModel.find({
      type: { $regex: type, $options: "i" },
    });

    if (showType.length > 0) {
      res.json(showType);
    } else {
      res
        .status(404)
        .json({ error: "Show type not found, try movie or tv%20show." });
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router.
export default router;

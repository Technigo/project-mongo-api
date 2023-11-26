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
    // Asynchronously retrieve all Netflix shows from the database.
    const result = await NetflixShowModel.find();
    // If the retrieval is successful, handle the result.
    res.json(result);

    // If an error occurs during the retrieval, handle the error.
  } catch (error) {
    res.json(error);
  }
});

// Define the route to find a show by show_id.
router.get("/netflix-show/:show_id", async (req, res) => {
  // Extract show_id from the request parameters.
  const { show_id } = req.params;

  try {
    // Find a Netflix show by show_id in the database.
    const netflixShowID = await NetflixShowModel.findOne({
      show_id: Number(show_id),
    });

    // If a show is found, return it as JSON. If not, return a 404 error.
    if (netflixShowID) {
      res.json(netflixShowID);
    } else {
      res.status(404).json({ error: "Netflix show not found, try another id" });
    }
  } catch (error) {
    // Handle any errors that occur during the database query.
    res.status(500).json({
      error: "Internal Server Error. Replace :show_id with a Netflix show id.",
    });
  }
});

// Export the router.
export default router;

import express from "express"; // Web framework for Node.js
import cors from "cors"; // Middleware to enable CORS
import mongoose from "mongoose"; // MongoDB object modeling tool
import dotenv from "dotenv"; // Loads environment variables from a .env file

import topMusicData from "./data/top-music.json"; // Sample data to seed the database
import Music from "./models/Music"; // Music model definition

// Load environment variables from .env
dotenv.config();

// MongoDB connection URL from .env or fallback to local database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl);
mongoose.Promise = Promise; // Use native promises with Mongoose

// Seed database if RESET_DB is true
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Music.deleteMany(); // Clear the database
    await Music.insertMany(topMusicData); // Seed the database
  };

  seedDatabase();
}

// Defines the port the app will run on.
const port = process.env.PORT || 8080;

// Creates an Express app instance
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// Root route (API documentation)
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Joyce's Top Music API!",
    endpoints: [
      { method: "GET", path: "/", description: "API documentation" },
      {
        method: "GET",
        path: "/tracks",
        description: "Get all music tracks",
        queryParameters: {
          artistName: "Filter by artist name",
          genre: "Filter by genre",
          bpm: "Filter by BPM (exact match)",
          popularity: "Filter by minimum popularity",
          sort: "Field to sort by (artistName, bpm, popularity)",
          order: "Sort order: 'asc' (default) or 'desc'",
        },
      },
      {
        method: "GET",
        path: "/tracks/:id",
        description: "Get a single music track by ID",
      },
    ],
  });
});

// Route to get all music tracks with filters and sorting
app.get("/tracks", async (req, res) => {
  // Destructure query parameters from the request
  const { artist, genre, bpm, popularity, sort, order = "asc" } = req.query;

  try {
    // Initialize query object to filter tracks
    const query = {};

    // Add artist filter to the query if provided
    if (artist) query.artistName = new RegExp(artist, "i"); // Case-insensitive regex search

    // Add genre filter to the query if provided
    if (genre) query.genre = new RegExp(genre, "i");

    // Add BMP filter to query if provided
    if (bpm) query.bpm = Number(bpm);

    // Add popularity filter to query if provided
    if (popularity) query.popularity = { $gte: Number(popularity) }; // Greater than or equal

    // Initialize sorting object
    let sortBy = {};
    if (sort) {
      const sortOrder = order === "desc" ? -1 : 1; // Set order (-1 for Descending, 1 for ascending)
      sortBy[sort] = sortOrder; // Dynamically set sort field and order
    }

    // Query database using query object and sort options
    const tracks = await Music.find(query).sort(sortBy);

    // Check if results exist
    if (tracks.length > 0) {
      // If results exist, send back JSON response
      res.json(tracks);
    } else {
      // If no results, send 404 status with error message
      res.status(404).json({ error: "No tracks found matching the criteria" });
    }
  } catch (error) {
    // Handle server errors and send 500 status with error message
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

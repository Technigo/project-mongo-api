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
      { method: "GET", path: "/tracks", description: "Get all music tracks" },
      {
        method: "GET",
        path: "/tracks/:id",
        description: "Get a single music track by ID",
      },
    ],
  });
});

// Route to get all music tracks
app.get("/tracks", async (req, res) => {
  try {
    const tracks = await Music.find(); // Fetch all tracks
    res.json(tracks); // Return the array of tracks
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// Route to get a single music track by ID
app.get("/tracks/:id", async (req, res) => {
  try {
    const track = await Music.findById(req.params.id); // Find track by MongoDB _id
    if (track) {
      res.json(track); // Returns track if found
    } else {
      res.status(404).json({ error: "Track not found" }); // Return 404 if track doesn't exist
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" }); // Handle invalid ID errors
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

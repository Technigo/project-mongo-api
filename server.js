import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import topMusicData from "./data/top-music.json";
import Music from "./models/Music";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

mongoose.connection.on("connected", () => console.log("Connected to MongoDB!"));
mongoose.connection.on("error", (error) =>
  console.error("MongoDB connection error:", error)
);

// Seed database if RESET_DB is true
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Music.deleteMany(); // Clear the database
    await Music.insertMany(topMusicData); // Seed the database
    console.log("Database seeded!");
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });
// Root route (API documentation)
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Top Music API!",
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
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// Route to get a single music track by ID
app.get("/tracks/:id", async (req, res) => {
  try {
    const track = await Music.findById(req.params.id); // Find track by MongoDB _id
    if (track) {
      res.json(track);
    } else {
      res.status(404).json({ error: "Track not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});
// Test MongoDB connection
// app.get("/test-db", async (req, res) => {
//   try {
//     const dbStatus = await mongoose.connection.db.admin().ping();
//     res.json({ message: "MongoDB is connected!", dbStatus });
//   } catch (error) {
//     res.status(500).json({ message: "MongoDB connection failed", error });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

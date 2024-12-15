import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Netflix } from "./models/NetflixModel.js";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Seed the database if RESET_DB is set
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Netflix.deleteMany({});
    netflixData.forEach(async (item) => {
      await new Netflix(item).save();
    });
  };
  seedDatabase();
}

// Home route with API documentation
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Marias Netflix API!",
    endpoints: [
      { path: "/", method: "GET", description: "API documentation" },
      { path: "/shows", method: "GET", description: "Get all shows" },
      {
        path: "/shows/:id",
        method: "GET",
        description: "Get a single show by ID",
      },
      {
        path: "/shows/search",
        method: "GET",
        description: "Search shows by filters (e.g., title, type, country)",
      },
    ],
  });
});

// Search shows by filters
app.get("/shows/search", async (req, res) => {
  const { title, type, country } = req.query;
  const query = {};

  if (title) {
    query.title = new RegExp(title, "i");
  }
  if (type) {
    query.type = type;
  }
  if (country) {
    query.country = country;
  }

  try {
    const shows = await Netflix.find(query);
    res.status(200).json(shows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shows", details: err.message });
  }
});

// Example stats route
app.get("/shows/stats", async (req, res) => {
  try {
    const count = await Netflix.countDocuments();
    res.status(200).json({ totalShows: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", details: err.message });
  }
});

// Get all shows with pagination
app.get("/shows", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

  try {
    const shows = await Netflix.find()
      .skip((page - 1) * limit) // Skip the results of previous pages
      .limit(Number(limit));   // Limit the number of results per page

    const totalShows = await Netflix.countDocuments(); // Count total number of documents
    const totalPages = Math.ceil(totalShows / limit); // Calculate total pages

    res.status(200).json({
      totalShows,
      totalPages,
      currentPage: Number(page),
      shows,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shows", details: err.message });
  }
});

// Get a single show by ID
app.get("/shows/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const show = await Netflix.findOne({ show_id: id });
    if (show) {
      res.status(200).json(show);
    } else {
      res.status(404).json({ error: "Show not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the show" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

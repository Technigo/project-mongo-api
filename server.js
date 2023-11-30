// First, require and configure dotenv to load the environment variables
require('dotenv').config();

import listEndpoints from 'express-list-endpoints';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json"; 
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/defaultdb";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB: ", err));



// Mongoose model for Show
const Show = mongoose.model('Show', {
  // Defineing the properties based on your JSON structure
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
});

 /* Seeding function
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Running seeding script...");
    await Show.deleteMany({});

    netflixData.forEach((showData) => {
      new Show(showData).save();
    });

    console.log("Seeding completed.");
  };

  seedDatabase();
}*/



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

// Endpoint to get all shows
app.get("/api/shows", async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
// Use for test /api/shows


// Endpoint to get a single show by ID
app.get("/api/shows/:id", async (req, res) => {
  try {
    const show = await Show.findOne({ show_id: req.params.id });
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ error: "Show not found" });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
// Use for test /api/shows/81193313

// Endpoint to get shows by release year
app.get("/api/shows/year/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year); // Convert year to a number
    const shows = await Show.find({ release_year: year });
    if (shows.length > 0) {
      res.json(shows);
    } else {
      res.status(404).json({ error: "No shows found for this year" });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Use for test /api/shows/year/2015

// Endpoint to search shows by title
app.get("/api/shows/title/:title", async (req, res) => {
  try {
    const titleSearch = new RegExp(req.params.title, 'i'); // 'i' for case-insensitive
    const shows = await Show.find({ title: { $regex: titleSearch } });
    if (shows.length > 0) {
      res.json(shows);
    } else {
      res.status(404).json({ error: "No shows found with this title" });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
  res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
// Use for test /api/shows/title/Hot%20Rod

// Endpoint to get shows by rating
app.get("/api/shows/rating/:rating", async (req, res) => {
  try {
    const rating = req.params.rating;
    const shows = await Show.find({ rating: rating });
    if (shows.length > 0) {
      res.json(shows);
    } else {
      res.status(404).json({ error: "No shows found with the specified rating" });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
// Use to test /api/shows/rating/TV-14

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

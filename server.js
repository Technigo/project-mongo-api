import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { endpoints } from 'express-list-endpoints';
import netflixData from "./data/netflix-titles.json";
import dotenv from "dotenv";
dotenv.config();

// Mongoose model for movies
const Movie = mongoose.model('Movie', {
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
  type: String,
});

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Insert netflixData into MongoDB on startup
const insertNetflixData = async () => {
  try {
    // Insert the Netflix data into the Movie collection
    await Movie.insertMany(netflixData);
    console.log('Netflix data inserted into MongoDB');
  } catch (error) {
    console.error('Error inserting Netflix data:', error);
  }
};

insertNetflixData(); // Call the function to insert data

// Express app setup
const port = process.env.PORT || 8080;
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Documentation route
app.get("/docs", (req, res) => {
  // Generate API documentation using express-list-endpoints
  const routes = endpoints(app);
  res.json(routes);
});

// Get all movies route
app.get('/movies', async (req, res) => {
  try {
    // Fetch all movies from the Movie collection
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    // Handle server error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single movie by ID route
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find a movie by its show_id in the Movie collection
    const movie = await Movie.findOne({ show_id: id });
    if (movie) {
      res.json(movie);
    } else {
      // Respond with 404 if movie is not found
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    // Handle server error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



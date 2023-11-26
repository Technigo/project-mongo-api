
import express from 'express';// Import the Express web framework
import cors from 'cors'; // Import Cross-Origin Resource Sharing middleware
import mongoose from 'mongoose'; // Import Mongoose for MongoDB integration
import netflixData from './data/netflix-titles.json'; // Import Netflix data from a local JSON file
import dotenv from 'dotenv'; // Import dotenv for managing environment variables
dotenv.config() // Load environment variables from a .env file

// Import Mongoose model and routes
import Movie from './movieModel'; // Import the Mongoose model for movies
import movieRoutes from './movieRoutes'; // Import custom routes for movies

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost/movie';  // Define MongoDB connection URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });// Connect to the MongoDB database
mongoose.Promise = Promise; // Use the global Promise library with Mongoose

// Set up Express application
const port = process.env.PORT || 8080; // Define the port for the Express server
const app = express(); // Create an instance of the Express application


const listEndpoints = require("express-list-endpoints")

// Use CORS and JSON parsing middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming requests with JSON payloads

// Database seeding (resetting) based on the RESET_DB environment variable
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Movie.deleteMany(); // Clear existing data in the Movie collection

      // Save each movie from the Netflix data into the Movie collection
      await Promise.all(netflixData.map(movieData => new Movie(movieData).save()));

      console.log('Database seeded successfully.');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  seedDatabase(); // Call the function to seed/reset the database

}


// Use the movieRoutes in your app under the root path ('/')
app.use('/', movieRoutes);



// Define a route to get a list of all endpoints in the application
app.get("/", (req, res) => {
  res.json(listEndpoints(app)); // Respond with a JSON array of endpoints
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// följ Technigo atlas deploy fram till step 4 - skriftliga - kolla även på videon - render: MongoURI - Render:

//Render = advanced settings
// env. config
// MONGO_URI=
// PORT=8080
// Import required modules and libraries
/* express for the web framework, cors for enabling Cross-Origin Resource Sharing, mongoose for MongoDB interactions, and dotenv for handling environment variables.
*/
import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// Import dotenv for handling environment variables
import dotenv from 'dotenv';
dotenv.config()

// Import booksData from a local JSON file
import booksData from "./data/books.json";

// Set up MongoDB connection using the provided URL from environment variables
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Set up the default port for the server, either from environment variable or 3000
const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

// Import express-list-endpoints for generating a list of available endpoints
const listEndpoints = require("express-list-endpoints")

// Add middlewares to enable CORS and parse incoming JSON data
app.use(cors());
app.use(express.json());

// Middleware to check MongoDB connection status before processing requests
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    // Return a 503 Service Unavailable status if MongoDB connection is not ready
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
  res.json(listEndpoints(app));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

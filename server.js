import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import netflixData from "./data/netflix-titles.json"; // Dataset.

// Load configuration variables from the .env file into process.env with purpose to keep sensitive inormation.
dotenv.config();

// Access the MONGO_URL environment variable, connects to MongoDB using Mongoose and sets Mongoose to use native JavaScript promises.
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// app.use(routes)
// Creates mongoose model with the name "NetflixShow".
const NetflixShow = mongoose.model("NetflixShow", {
  show_id: Number,
  title: String,
  director: [String],
  cast: [String],
  country: [String],
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: [String],
  description: String,
  type: String,
});

// const seedDatabase = async () => {
//   try {
//     // Remove all existing documents in the Netflix shows collection.
//     await NetflixShow.deleteMany({});

//     // Use map to create an array of promises, one for each document to be saved.
//     const savePromises = netflixData.map(async (NetflixShowItem) => {
//       // Creating a new NetflixShows document using data from netflixShowItem and returning the promise.
//       return new NetflixShow(NetflixShowItem).save();
//     });

//     // Wait for all the promises to resolve before moving on.
//     await Promise.all(savePromises);

//     console.log("Database seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// };

// seedDatabase();

// Defines the port the app will run on. Defaults to 8080.
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing.
app.use(cors());
app.use(express.json());

// Start defining your routes here.
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Route for documentation and "/" with endpoints.
//***---------- Endpoint GET to fetch all Netflix shows ----------***
app.get("/netflix-shows", async (req, res) => {
  try {
    //Fetch all Netflix shows from the database.
    const allNetflixShows = await NetflixShow.find();
    // Send the array of Netflix shows as a JSON response.
    res.json(allNetflixShows);
  } catch (error) {
    // If there is an error, send an error response.
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a single Netflix show by ID.
//***---------- Endpoint GET to fetch a single Netflix show ----------***
app.get("/netflix-show/:show_id", async (req, res) => {
  try {
    // Extract the show_id from the request parameters.
    const { show_id } = req.params;

    // Fetch the Netflix show from the database based on the show_id.
    const singleNetflixShow = await NetflixShow.findOne({
      show_id: parseInt(show_id),
    });

    // Check if the Netflix show was found.
    if (singleNetflixShow) {
      // Send the Netflix show as a JSON response.
      res.json(singleNetflixShow);
    } else {
      // If the Netflix show with the specified ID is not found, send a 404 response
      res.status(404).json({ error: "Netflix show not found, try another id" });
    }
  } catch (error) {
    // If there is an error, send an error response
    res
      .status(500)
      .json({
        error: "Internal Server Error. Replace :show_id with a single show id.",
      });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

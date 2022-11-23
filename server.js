import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import theOfficeData from "./data/the_office_series.json";

// This is the database collection: 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
// Set up code according to documentation:
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Episode = mongoose.model("Episode", {
  Id: Number,
  Season: Number,
  EpisodeTitle: String,
  About: String,
  Ratings: Number,
  Votes: Number,
  Viewership: Number,
  Duration: Number,
  Date: String,
  GuestStars: String,
  Director: String,
  Writers: String,
});

// Generate entries into the db from the json file:
// if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Episode.deleteMany();
    theOfficeData.forEach((singleEpisode) => {
      const newEpisode = new Episode(singleEpisode);
      newEpisode.save();
    })
  }
  resetDataBase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route for start page
app.get("/", (req, res) => {
  // res.send("Hello Technigo!");
  // Start page lists the two routes available:
  res.json(listEndpoints(app));
});

app.get("/episodes", (req, res) => {
  res.json()
})


// Route for episodes for a specific season:
app.get("/seasons/:season", async (req, res) => {
  const number = Number(req.params.season)
  const season = await Episode.find({ Season: number });
  if (season.length > 0) {
    res.json(season)
  } else {
    res.status(404).json({ error: 'Season not found' })
  }
});

// Route for a specific title
app.get("/episodes/:title", async (req, res) => {
  const name = req.params.title
  const title = await Episode.findOne({ EpisodeTitle: name }) 
  // how to make this searchable with a keyword?  
  // db.content.find({$text:{$search:"love"}})  
  // Episode.createIndexes({ EpisodeTitle: "text" })
  if (title) {
    res.json(title)
  } else {
    res.status(404).json({ error: 'Title not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

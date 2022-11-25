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
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Episode.deleteMany();
    theOfficeData.forEach((singleEpisode) => {
      const newEpisode = new Episode(singleEpisode);
      newEpisode.save();
    })
  }
  resetDataBase();
}

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
  // Start page lists the routes available:
  res.json(listEndpoints(app));
});

// Route for all episodes available in the series
app.get("/episodes", async (req, res) => {
  const { title } = req.query;
  const titleQuery = title ? title : /.*/;
  
  try {
    const all = await Episode.find({EpisodeTitle: titleQuery})
    res.json(all)
  } catch(error) {
      res.send('No data found') //STATUS HERE??
  }
})

// Route for top 5 rated episode
app.get("/episodes/top_5", async (req, res) => {
  try {
    const best = await Episode.find().limit(5).sort({ Ratings: -1}).select({EpisodeTitle: 1, About: 1, Ratings: 1, Season: 1})
    res.json(best)
  } catch(error){
      res.send(error) 
  }
})

// Route for a single episode
app.get("/episodes/:id", async (req, res) => {
  try {
    const singleEpisode = await Episode.findOne({_id: req.params.id})
    res.json(singleEpisode)
  } catch(error){
      res.send(error) 
  }
})

// Route for episodes for a specific season:
app.get("/episodes/seasons/:season", async (req, res) => {
  const number = req.params.season
  const season = await Episode.find({ Season: number });
  try {
    if (season.length > 0) {
      res.json(season)
    } else {
      res.status(404).json({ error: 'Season not found' })
    }
  } catch(error){
    res.send(error)
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

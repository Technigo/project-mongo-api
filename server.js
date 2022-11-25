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

// Middleware that happens around each request, checks if db is connected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({error: 'Service unavailable'})
  }
})

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
    const singleTitle = await Episode.find({ EpisodeTitle: titleQuery })

    // find() returns an array, therefore .length is used to check for results
    if (singleTitle.length > 0) {
      res.json(singleTitle)
    } else {
      res.status(404).json({ error: 'Episode not found' })
    }
  } catch(error) {
      res.status(400).json({ error: 'Invalid request' })
    }
})

// Route for top 5 rated episodes
app.get("/episodes/ratings/top_5", async (req, res) => {
  try {
    const bestRated = await Episode.find().limit(5).sort({ Ratings: -1}).select({EpisodeTitle: 1, About: 1, Ratings: 1, Season: 1})
    if (bestRated.length > 0) {
      res.json(bestRated)
    } else {
        res.status(404).json({ error: 'No episodes found'})
    }
  } catch(error){
      res.status(400).json({ error: 'Invalid request' })
  }
})

// Route for 5 worst rated episodes
app.get("/episodes/ratings/bottom_5", async (req, res) => {
  try{
    const worstRated = await Episode.find().limit(5).sort({Ratings: 1}).select({EpisodeTitle: 1, About: 1, Ratings: 1, Season: 1})
    if (worstRated.length > 0) {
      res.json(worstRated)
    } else {
        res.status(404).json({ error: 'No episodes found' })
    }
  } catch(error){
      res.status(400).json({ error: 'Invalid request' })
  }
})

// Route for most viewed episode
app.get("/episodes/views/most_viewed", async (req, res) => {
  try {
    const mostViewed = await Episode.find().limit(1).sort({Viewership: -1})
    if (mostViewed.length > 0) { 
      res.json(mostViewed)
    } else {
        res.status(404).json({ error: 'Episode not found' })
    }
  } catch(error) {
      res.status(400).json({ error: 'Invalid request' })
  }
})

// Route for least viewed episode
app.get("/episodes/views/least_viewed", async (req, res) => {
  try {
    const leastViewed = await Episode.find().limit(1).sort({Viewership: 1})
    if (leastViewed.length > 0) { 
      res.json(leastViewed)
    } else {
        res.status(404).json({ error: 'Episode not found' })
    }
  } catch(error) {
      res.status(400).json({ error: 'Invalid request' })
  }
})

// Route for a single episode
app.get("/episodes/:id", async (req, res) => {
  try {
    const singleEpisode = await Episode.findById({_id: req.params.id})
    if (singleEpisode) {
      res.json(singleEpisode)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch(error){
      res.status(400).json({ error: 'Invalid episode id' }) 
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
      res.status(400).json({ error: 'Invalid request' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

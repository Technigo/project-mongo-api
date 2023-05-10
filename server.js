import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json"

// This is where the application is connecting to the MongoDB database.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// creating a Mongoose Schema and model ( the wrapper on the mongoose schema )

const SongStructure = new mongoose.Schema({
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})
const Song = mongoose.model("Song", SongStructure);

// Resetting the Database
HERE
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=8080 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use ((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
 
  } else {
    res.status(503).json ({ error: 'Service unavailable'})
  }
})

// Start defining your routes here

// ALL SONGS ROUTE 
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// SONGS by ID

app.get("/songs/:id", async (req, res) => {
  const songById = await Song.findById(req.params.id).exec();

  try {
    if (songById) {
      res.status(200).json({
        success: true,
        body: songById
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: " This song id doesnt exist"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id song "
      }
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

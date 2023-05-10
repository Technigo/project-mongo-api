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

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();

    for (let song of topMusicData) {
      const newSong = new Song(song);
      await newSong.save();
    }

  };
  resetDatabase();
};

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
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    body: {
      Routes: "/songs – all songs, /songs/:id – single song by its id.",
      Queries: "/songs – bpm, genre"
    }
  });
});

app.get("/songs/", async (req, res) => {
  let {bpm, genre} = req.query;
  bpm = bpm ? Number(bpm) : null;

  let query = {};

  if (genre) {
    query.genre = genre;
  }

  if (bpm) {
    query.bpm = bpm;
  }

  try {
    const songs = await Song.find(query).exec();
    res.status(200).json({
      success: true,
      body: songs
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "No songs found"
      }
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

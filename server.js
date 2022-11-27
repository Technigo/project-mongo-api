import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const User = mongoose.model("user", {
  name: String,
  age: Number,
  deceased: Boolean
});

const Song = mongoose.model("Song", {
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
});

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save()
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to top music on Spotify! Look for your favorite top music with these endpoints.");
});

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});

app.get("/songs/", async (req, res) => {

  const {
    genre, 
    trackName, 
    artistName,
    bpm, 
    energy,
    danceability,
    loudness,
    liveness,
    valence,
    length,
    acousticness,
    speechiness,
    popularity
  } = req.query;
  
  const response = {
    success: true,
    body: {}
  }

  const trackNameQuery = trackName ? trackName : /.*/;
  const genreQuery = genre ? genre : /.*/;
  const artistNameQuery = artistName ? artistName : /.*/;
  const bpmQuery = bpm ? bpm : {$gt: 0, $lt: 300};
  const energyQuery = energy ? energy : {$gt: 0, $lt: 100};
  const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100};
  const loudnessQuery = loudness ? loudness : {$gt: -100, $lt: 1};
  const livenessQuery = liveness ? liveness : {$gt: 0, $lt: 100};
  const valenceQuery = valence ? valence : {$gt: 0, $lt: 100};
  const lengthQuery = length ? length : {$gt: 0, $lt: 1000};
  const acousticnessQuery = acousticness ? acousticness : {$gt: 0, $lt: 100};
  const speechinessQuery = speechiness ? speechiness : {$gt: 0, $lt: 100};
  const popularityQuery = popularity ? popularity : {$gt: 0, $lt: 100};

  try {
    response.body = await Song.find({
      trackName: trackNameQuery,
      artistName: artistNameQuery,
      genre: genreQuery,
      bpm: bpmQuery,
      energy: energyQuery,
      danceability: danceabilityQuery,
      loudness: loudnessQuery,
      liveness: livenessQuery,
      valence: valenceQuery,
      length: lengthQuery,
      acousticness: acousticnessQuery,
      speechiness: speechinessQuery,
      popularity: popularityQuery
    });

    res.status(200).json({
      success: true,
      body: response
    });

  } catch (error) {
      res.status(400).json({
        success: false,
        body: {
          message: error
        }
      });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

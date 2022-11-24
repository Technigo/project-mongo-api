import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const songSchema = new mongoose.Schema({
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

const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();

    topMusicData.forEach(song => {
      const newSong = new Song(song).save();
    });
  };
  resetDatabase();
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Baaaaaa!");
});

/* app.get("/songs", async (req, res) => {
  const allSongs = await Song.find({});

  try {
    
  }
}); */
app.get("/songs/", async (req, res) => {
  const {genre, bpm} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const genreQuery = genre ? genre : /.*/gm;
  const bpmQuery = bpm ? bpm : /.*/gm;
  // const matchAllRegEx = newRegExp (".*");

  try {
    response.body = await Song.find({genre: genreQuery, bpm: bpmQuery})
    res.status(200).json({response});
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "No songs found"
      }
    });
  }
});

app.get("/songs/:id", async (req, res) => {
  try {
    const songById = await Song.findById(req.params.id);
    if (songById) {
      res.status(200).json({
        success: true,
        body: songById
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

// https://regex101.com
// blablbalbbalb/gm – regex to match blablbalbbalb
// /.*/gm – regex to match every character in a string

    // funktion att chain:a på om man vill begränsa sökresultaten: 
    // .limit(2).sort({}).select({trackName: 1, artistName: 1});
    // select bestämmer strukturen på responsen till frontend 
    // för att inte hämta/skicka mer info än nödvändigt
    // .exec() => to explore if you're curious enough


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

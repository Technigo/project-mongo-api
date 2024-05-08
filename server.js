import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

const songSchema = new mongoose.Schema({
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
  popularity: Number,
});

const Song = mongoose.model("Song", songSchema);

const seedDatabase = async () => {
  if (process.env.RESET_DB) {
    await Song.deleteMany({});

    topMusicData.forEach(async (songData) => {
      const newSong = new Song(songData);
      await newSong.save();
    });
  }
};

seedDatabase();


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Music API",
    availableEndpoints: listEndpoints(app),
  });
});

// API Endpoints
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

app.get("/songs/:id", async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (song) {
    res.json(song);
  } else {
    res.status(404).send("Song not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

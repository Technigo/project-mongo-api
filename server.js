import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongoEZR";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Seeding with database

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
  popularity: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany({});

    topMusicData.forEach((songData) => {
      new Song(songData).save();
    });
  };

  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(expressListEndpoints(app));
});

app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

app.get("/songs/:id", async (req, res) => {
  const songID = req.params.id;
  const songInfo = await Song.findOne({ id: songID }).exec();
  if (songInfo !== null) {
    res.json(songInfo);
  } else {
    res.status(404).send("Information not found, please try again");
  }
});

app.get("/songs/genre/:genre", async (req, res) => {
  const songGenre = req.params.genre;
  const songsByGenre = await Song.find({
    genre: songGenre,
  }).exec();
  if (songsByGenre !== null) {
    res.json(songsByGenre);
  } else {
    res.status(404).send("Information not found, please try again");
  }
});

app.get("/songs/popularity/:popularityScore", async (req, res) => {
  const songPopularity = req.params.popularityScore;
  const songsByPopularity = await Song.find({
    popularity: { $gte: songPopularity },
  }).exec();
  if (songsByPopularity !== null) {
    res.json(songsByPopularity);
  } else {
    res.status(404).send("Information not found, please try again");
  }
});

app.get("/songs/artist/:artistName", async (req, res) => {
  const artistName = req.params.artistName;
  const songsByArtist = await Song.find({
    artistName,
  }).exec();
  if (songsByArtist !== null) {
    res.json(songsByArtist);
  } else {
    res.status(404).send("Information not found, please try again");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import songs from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
  popularity: Number,
});

const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Song.deleteMany();

    songs.forEach((item) => {
      const newSong = new Song(item);
      newSong.save();
    });
  };

  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/songs", async (req, res) => {
  const { song_name } = req.query;

  if (song_name) {
    const songs = await Song.find({
      trackName: {
        $regex: new RegExp(song_name, "i"),
      },
    });
    res.json(songs);
  } else {
    const songs = await Song.find();
    res.json(songs);
  }
});

app.get("/songs/:songId", async (req, res) => {
  const { songId } = req.params;
  const singleSong = await Song.findOne({ _id: songId });
  res.json(singleSong);
});

app.get("/songs/artist_name/:artistName", async (req, res) => {
  const { artistName } = req.params;

  const singleSong = await Song.findOne({ artistName: artistName });
  res.json(singleSong);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import listEndpoints from "express-list-endpoints";

import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

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
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  };
  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//RETURNS THE WHOLE LIST OF ARTIST AND SONGS
app.get("/artists", async (req, res) => {
  const artists = await Song.find();
  res.json(artists);
});

//RETURNS THE FIRST FOUND SONG BY A SPECIFIC ARTIST
app.get("/songs/song/:artistName", async (req, res) => {
  const singleSong = await Song.findOne({ artistName: req.params.artistName });
  res.send(singleSong);
});

//RETURNS SPECIFIC ARTIST AND/OR SONG //QUERYPARAMS
app.get("/songs/song", async (req, res) => {
  const { artistName, trackName } = req.query;

  const myRegex = /.*/gm;

  if (trackName) {
    const singleSong = await Song.find({
      artistName: artistName ? artistName : myRegex,
      trackName: trackName,
    });
    res.send(singleSong);
  } else {
    const singleSong = await Song.find({ artistName: artistName });
    res.send(singleSong);
  }
});

//RETURNS ALL SONGS IN ONE GENRE
app.get("/songs/genre/:genre", async (req, res) => {
  const totalGenre = await Song.find({ genre: req.params.genre });
  res.send(totalGenre);
});

// //RETURNS ALL SONGS WITH A DANCEABILITY OVER A SPECIFIC NUMBER
app.get("/songs/dance/:dance", async (req, res) => {
  const danceability = JSON.parse(req.params.dance);
  const forTheParty = await Song.find().where("danceability").gt(danceability);
  res.send(forTheParty);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

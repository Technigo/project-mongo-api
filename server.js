/* eslint-disable comma-dangle */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swiftData from "./data/swift-data.json";

// import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Song = mongoose.model("Song", {
  index: Number,
  name: String,
  album: String,
  artist: String,
  release_date: String,
  length: Number,
  popularity: Number,
  danceability: Number,
  acousticness: Number,
  energy: Number,
  instrumentalness: Number,
  liveness: Number,
  loudness: Number,
  speechiness: Number,
  valence: Number,
  tempo: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany({});

    swiftData.forEach((item) => {
      const newSong = new Song(item);
      newSong.save();
    });
  };
  seedDatabase();
}

// Startingpoint
app.get("/", (req, res) => {
  res.send("This is the Taylor Swift song database");
});

// Displays all songs
app.get("/songs", async (req, res) => {
  const songs = await Song.find({});
  res.json(songs);
});

// displays all songs based on an album
app.get("/album", async (req, res) => {
  const songs = await Song.find(req.query);
  res.json(songs);
});
// displays a song index
app.get("/songs/index/:index", async (req, res) => {
  const song = await Song.find(req.params);
  res.json(song);
});

// displays one single song
app.get("/songs/id/:id", async (req, res) => {
  try {
    const songById = await Song.findById(req.params.id);
    if (songById) {
      res.json(songById);
    } else {
      res.status(404).json({ error: "Cannot get song by that id" });
    }
  } catch (error) {
    res.status(400).json({ error: "invalid id" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

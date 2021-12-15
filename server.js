/* eslint-disable comma-dangle */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import swiftData from "./data/swift-data.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

// Sets the database
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

// Startingpoint with all endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Displays all songs
app.get("/songs", async (req, res) => {
  const songs = await Song.find({});
  res.json(songs);
});

// displays a song based on index
app.get("/songs/index/:index", async (req, res) => {
  try {
    const song = await Song.find(req.params);
    if (song) {
      res.json(song);
    } else {
      res.status(404).json({ error: "Cannot get song by that index" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid index" });
  }
});

// Get a song by it's title
app.get("/songs/name/:name", async (req, res) => {
  try {
    const name = await Song.find(req.params).collation({
      locale: "en",
      strength: 2,
    });
    if (name) {
      res.json(name);
    } else {
      res.status(404).json({ error: "Cannot get the song by that title" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid title" });
  }
});

// Get an album by it's title
app.get("/songs/album/:album", async (req, res) => {
  try {
    const album = await Song.find(req.params).collation({
      locale: "en",
      strength: 2,
    });
    if (album) {
      res.json(album);
    } else {
      res.status(404).json({ error: "Cannot get the album by that title" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid album name" });
  }
});

// Get songs that have the length greater than what is written in the bar
app.get("/songs/length", async (req, res) => {
  let songs = await Song.find(req.query);
  if (req.query.length) {
    const songsByLength = await Song.find().gt("length", req.query.length);
    songs = songsByLength;
  }

  res.json(songs);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

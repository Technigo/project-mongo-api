import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const Song = mongoose.model("Song", {
  // Properties defined here match the keys from the people.json file
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
  popularity: {
    type: Number,
    min: 0,
    max: 100,
  },
});

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/top-music";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB");
mongoose.Promise = Promise;

const expressListEndpoints = require("express-list-endpoints");
const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(expressListEndpoints(app));
});

// Aggregated genre stats
app.get("/songs/genre-stats", async (req, res) => {
  try {
    const genreStats = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          numberOfSongs: { $sum: 1 },
          averagePopularity: { $avg: "$popularity" },
          averageBPM: { $avg: "$bpm" },
        },
      },
      {
        $sort: { numberOfSongs: -1 },
      },
    ]);

    res.json(genreStats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/songs/:id", async (req, res) => {
  const songId = req.params.id;
  try {
    const song = await Song.findOne({ id: parseInt(songId) });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Songs by popularity, genre, bpm, divided by 10 per page

app.get("/songs", async (req, res) => {
  const { popularity, genre, bpm, page = 0 } = req.query;

  const songsPerPage = 10;
  const pageNumber = parseInt(page);

  let songs = await Song.find()
    .skip(pageNumber * songsPerPage)
    .limit(songsPerPage);

  if (popularity) {
    if (popularity !== "most popular" && popularity !== "least popular") {
      res.status(400).json({
        message:
          "Invalid popularity value. Sort by 'most popular' or 'least popular'.",
      });
    }
    if (popularity === "most popular") {
      songs.sort((a, b) => b.popularity - a.popularity);
    } else if (popularity === "least popular") {
      songs.sort((a, b) => a.popularity - b.popularity);
    }
  }

  if (genre) {
    const searchTerms = genre.toLowerCase().split(" ");
    songs = songs.filter((song) =>
      searchTerms.every((term) => song.genre.toLowerCase().includes(term))
    );
  }

  if (bpm) {
    if (bpm !== "slow" && bpm !== "fast") {
      res
        .status(400)
        .json({ message: "Invalid bpm value. Sort by 'slow' or 'fast'." });
    }
    if (bpm === "slow") {
      songs = await Song.where("bpm").lt(120);
    } else if (bpm === "fast") {
      songs = await Song.where("bpm").gte(120);
    }
  }

  if (songs.length === 0) {
    res.status(404).json({ message: "No songs found" });
  }

  res.json(songs);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

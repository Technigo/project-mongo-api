import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

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
  popularity: Number,
});

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/top-music";
mongoose.connect(mongoUrl);
console.log("Connected to MongoDB");
mongoose.Promise = Promise;

const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/songs", async (req, res) => {
  const { popularity, genre } = req.query;

  let songs = await Song.find();

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

  if (songs.length === 0) {
    res.status(404).json({ message: "No songs found" });
  }

  res.json(songs);
});

app.get("/songs/:id", (req, res) => {
  const songId = req.params.id;
  const song = topMusicData.find((song) => song.id === Number(songId));
  if (!song) {
    res.status(404).json({ message: "Song not found" });
  }
  res.json(song);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

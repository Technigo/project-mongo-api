import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import songs from "./data/top-music.json";
import genres from "./data/music-genres.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const songSchema = new mongoose.Schema({
  id: Number,
  trackName: String,
  artistName: String,
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
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

const genreSchema = new mongoose.Schema({
  description: String,
});

const Genre = mongoose.model("Genre", genreSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Song.deleteMany();
    await Genre.deleteMany();

    const genresArray = [];

    genres.forEach(async (item) => {
      const genre = new Genre(item);
      genresArray.push(genre);
      await genre.save();
    });

    songs.forEach(async (item) => {
      const newSong = new Song({
        ...item,
        genre: genresArray.find(
          (singleGenre) => singleGenre.description === item.genre
        ),
      });
      await newSong.save();
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

  try {
    const singleSong = await Song.findOne({ artistName: artistName });
    res.json(singleSong);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

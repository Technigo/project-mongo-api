import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import data from "./data/top-music.json";

dotenv.config()

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
  popularity: Number
});


if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany();
    data.forEach(singleSong => {
      const newSong = new Song(singleSong)
      newSong.save();
    })
  }
  seedDatabase();
}

// Added middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Routes defined 
app.get("/", (req, res) => {
  const Main = {
    About:
      "An API with 50 popular Spotify tracks",
    Routes: [
      {
        "/api/songs": "Get all songs",
        "/api/genres/{genre}": "Get all songs in a specific genre",
        "/api/artists/{artistName}": "Get songs from a specific artist",
        "/api/titles/{trackName}": "Get a song by its title name",
        "/api/ids/{id}": "Get a songs by its ID"
      },
    ],
  };
  res.send(Main);
});

app.get("/api/songs", async (req, res) => {
  const songs = await Song.find();
  
  res.send(songs);
})

app.get("/api/genres/:genre", async (req, res) => {
  const songsByGenre = await Song.find({ genre: req.params.genre });
  
  res.send(songsByGenre);
});

app.get("/api/artists/:artistName", async (req, res) => {
  const songsByArtist = await Song.find({ artistName: req.params.artistName });

  res.send(songsByArtist);
})

app.get("/api/titles/:trackName", async (req, res) => {
  const songByTitle = await Song.findOne({ trackName: req.params.trackName });

  res.send(songByTitle);
})

app.get("/api/song/:id", async (req, res) => {
  const songById = await Song.findOne({ id: req.params.id });

  res.send(songById);
})

// Starting the server
app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});

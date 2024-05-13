import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/top-music-spotify";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const { Schema } = mongoose;

// Schema
const musicSchema = new Schema({
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
  populariy: Number,
});

// The Model
const Music = mongoose.model("Music", musicSchema);

// Seed the database
const seedDataBase = async () => {
  try {
    await Music.deleteMany();

    topMusicData.forEach(async (song) => {
      await new Music(song).save();
    });
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
seedDataBase();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here

// http://localhost:8080/
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);

  res.json(endpoints);
});

// Get all songs
// http://localhost:8080/songs
app.get("/songs", async (req, res) => {
  const allSongs = await Music.find();

  if (allSongs.length > 0) {
    res.json(allSongs);
  } else {
    res.status(404).send("no songs was found based on the filters");
  }
});

// Get one song based on id
// http://localhost:8080/songs/2
app.get("/songs/:songId", async (req, res) => {
  const { songId } = req.params;
  console.log("Requested song ID:", songId);

  try {
    const song = await Music.findById(songId).exec();

    if (song) {
      res.json(song);
    } else {
      console.log("No song was found with ID", songId);
      res.send("No song was found");
    }
  } catch (error) {
    console.error("Error fetching song", error);
    res.status(500).send("An error occured while fetching the song");
  }
});

// Get artist of a specifik song
// http://localhost:8080/songs/2/artist
app.get("/songs/:songId/artist", async (req, res) => {
  const { songId } = req.params;

  const song = await Music.findById(songId).exec();

  if (song) {
    res.json({ artistName: song.artistName });
  } else {
    res.send("No song was found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

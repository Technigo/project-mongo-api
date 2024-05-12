import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
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


const seedDatabase = async () => {
  try {
    await Song.deleteMany({});

    topMusicData.forEach((songData) => {
      new Song(songData).save();
    });
    console.log("Done");
  } catch (err) {
    console.error(err);
  }
};

seedDatabase();


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Music API",
    availableEndpoints: listEndpoints(app),
  });
});

// API Endpoints
app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});


app.get("/songs/:id", async (req, res) => {
  const songID = req.params.id;
  const songInfo = await Song.findOne({ id: songID }).exec();
  if (songInfo) {
    res.json(songInfo);
  } else {
    res.status(404).send("Song not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

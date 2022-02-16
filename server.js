import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import musicData from "./data/music.json";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Music = mongoose.model("Music", {
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Music.deleteMany({});

    musicData.forEach((item) => {
      const newMusic = new Music(item);
      newMusic.save();
    });
  };
  seedDatabase();
}

app.get("/", async (req, res) => {
  res.json("hello");
});

app.get("/tracks", async (req, res) => {
  const allTracks = await Music.find();
  res.json(allTracks);
});

app.get("/artist/:artist", async (req, res) => {
  try {
    const searchArtist = req.params.artist;

    const findArtist = await Music.find({ artistName: searchArtist });

    if (findArtist) {
      res.json(findArtist);
    } else {
      res.status(404).json({ error: "No artist found" });
    }
  } catch (err) {
    res.status(400).json({ error: "artist is not valid" });
  }
});

app.get("/artists/:id", async (req, res) => {
  try {
    const searchId = req.params.id;
    const songId = await Music.findOne({ id: searchId });

    if (songId) {
      res.json(songId);
    } else {
      res.status(404).json({
        response: "No song found, with this ID",
        success: false
      });
    }
  } catch (err) {
    res.status(400).json({ error: "error" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api-Irupe";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const { Schema } = mongoose;

const songSchema = new Schema({
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

const Song = mongoose.model("Song", songSchema);


if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  }
  resetDatabase();
}
app.get("/allsongs", async (req, res) => {
  try {
    const allSongs = await Song.find();
    res.status(200).json({
      success: true,
      body: allSongs
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

app.get("/artists/:artistName", async (req, res) => {
  try {
    const artist = await Song.find({ artistName: req.params.artistName });

    if (artist) {
      res.status(200).json({
        success: true,
        body: artist
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Artist not found"
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
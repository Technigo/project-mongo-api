import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import musicData from "./data/music.json";


const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
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

/* templat för vad som finns i ett objekt   */

const Music = mongoose.model("Music", {
  id: Number,
  track: String,
  artist: String,
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

/* spara ny data */
/* if  för att undvika att datasetet dubbliseras */

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Music.deleteMany({})

    musicData.forEach((item) => {
      const newMusic = new Music(item);
      newMusic.save();
    });
  };

  seedDatabase();
}

// get full dataset
app.get("/", async (req, res) => {
  
  res.json('hello')
});



app.get("/artists/:artist", async (req, res) => {
  try {
    const artist = await Music.find({ artist: req.params.artist })
    if (artist) {
      res.json(artist)
    } else {
      res.status(404).json({ error: "No artist found" })
    }
  } catch (err) {
    res.status(400).json({ error: "artist is not valid" })
  }
})

app.get("/id/:id", async (req, res) => {
  try {
    const songId = await Music.findById({ id: req.params.id });

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

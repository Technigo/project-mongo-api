import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from "./data/golden-globes.json";
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

const MusicList = mongoose.model("MusicList", {
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await MusicList.deleteMany({});

    topMusicData.forEach((music) => {
      const newMusicList = new MusicList(music);
      newMusicList.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Camilla och Lottas MongoApi");
});
app.get("/music", async (req, res) => {
  let music = await MusicList.find(req.query);
  if (req.query.danceability) {
    const musicSlowDance = await MusicList.find().lt(
      "danceability",
      req.query.danceability
    );
    music = musicSlowDance;
  }

  res.json(music);
});

app.get("/music/slowdance", async (req, res) => {
  const slowDance = await MusicList.find().lt("danceability", 50);
  res.json(slowDance);
});

app.get("/music/speeddance", async (req, res) => {
  const speeddance = await MusicList.find().gt("danceability", 50);
  res.json(speeddance);
});

app.get("/music/popular", async (req, res) => {
  const popular = await MusicList.find().gt("popularity", 50);
  res.json(popular);
});

app.get("/music/unpopular", async (req, res) => {
  const unpopular = await MusicList.find().lt("popularity", 50);
  res.json(unpopular);
});

app.get("/music/id/:id", (req, res) => {
  try {
    MusicList.findOne({ id: req.params.id }).then((id) => {
      if (id) {
        res.json(id);
      } else {
        res.status(404).json("artist not found");
      }
    });
  } catch (err) {
    res.status(404).json({ error: "Invalid id" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

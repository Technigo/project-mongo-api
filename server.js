import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
//import goldenGlobesData from "./data/golden-globes.json";
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "unavailable" });
  }
});

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
  res.send(listEndpoints(app));
});

app.get("/music", async (req, res) => {
  try {
    let music = await MusicList.find(req.query);
    if (music) {
      res.json(music);
    } else {
      res.status(404).json("music not found");
    }
  } catch (err) {
    res.status(404).json({ error: "Invalid id" });
  }
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

app.get("/music/slowdance", async (req, res) => {
  try {
    const slowDance = await MusicList.find().lt("danceability", 50);
    if (slowDance) {
      res.json(slowDance);
    } else {
      res.status(404).json("there wasn't such a slow song");
    }
  } catch (err) {
    res.status(404).json({ error: "there wasn't such a slow song" });
  }
});

app.get("/music/discodance", async (req, res) => {
  try {
    const discoDance = await MusicList.find().gt("danceability", 50);
    if (discoDance) {
      res.json(discoDance);
    } else {
      res.status(404).json("there wasn't such a disco track");
    }
  } catch (err) {
    res.status(404).json({ error: "there wasn't such a slow song" });
  }
});

app.get("/music/popular", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const popular = await MusicList.find()
      .gt("popularity", 50)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (popular) {
      res.json({ total: popular.length, popular });
    } else {
      res.status(404).json("could not found that popular track");
    }
  } catch (err) {
    res.status(404).json({ error: "could not found that popular track" });
  }
});

app.get("/music/unpopular", async (req, res) => {
  const unPopular = await MusicList.find().limit(1).lt("popularity", 80);
  res.json(unPopular);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

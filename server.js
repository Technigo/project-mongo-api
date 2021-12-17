import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import topMusic from "./data/top-music.json";
import listEndpoints from "express-list-endpoints";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongoose";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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
  popularity: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Music.deleteMany({});

    topMusic.forEach((music) => {
      const newMusic = new Music(music);
      newMusic.save();
    });
  };
  seedDatabase();
}

// My endpoints
app.get("/", async (req, res) => {
  res.send(listEndpoints(app));
});
// you can search with any query params in this rout
app.get("/music/:page", async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.params;
    let music = await Music.find(req.query)
      .limit(20)
      .skip((page - 1) * limit);

    if (req.query.danceability) {
      const slowDance = await Music.find().lt(
        "danceability",
        req.query.danceability
      );
      music = slowDance;
    }

    if (music) {
      res.json({ page: +page, total: music.length, music });
    } else {
      res.status(404).json("No music");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "no music!" });
  }
});
//Showing all objects with a danceability bellow 50
app.get("/music/slowdance", async (req, res) => {
  const slowDance = await Music.find().lt("danceability", 50).find(req.query);
  res.json(slowDance);
});
//showing all object with a danceability over 50
app.get("/music/speedance", async (req, res) => {
  try {
    const speedance = await Music.find().gt("danceability", 50).find(req.query);

    if (speedance) {
      res.json(speedance);
    } else {
      res.status(404).json("no speed here");
    }
  } catch (err) {
    res.status(402).json({ error: "Invalid id" });
  }
});
//showing the most popular songs and you can shange page and limit with queries
app.get("/music/popular", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const popular = await Music.find()
      .gt("popularity", 90)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (popular) {
      res.json({ total: popular.length, popular });
    } else {
      res.status(404).json("not top popular");
    }
  } catch (err) {
    res.status(402).json({ error: "Invalid id" });
  }
});
// finding a uniq id
app.get("/music/id/:id", (req, res) => {
  try {
    Music.findOne({ id: req.params.id }).then((id) => {
      if (id) {
        res.json(id);
      } else {
        res.status(404).json("artist not found");
      }
    });
  } catch (err) {
    res.status(402).json({ error: "Invalid id" });
  }
});
//search with query params for genre
app.get("/music/genre", async (req, res) => {
  try {
    const { genre } = req.query;
    const findGenre = await Music.find({
      genre: { $regex: `.*${genre}*.` },
    });
    if (findGenre.length > 0) {
      res.json(findGenre);
    } else {
      res.status(404).json("genre not found");
    }
  } catch (err) {
    res.status(404).json({ error: "Invalid genre" });
  }
});
//search with query params for artist
app.get("/artist", async (req, res) => {
  try {
    const { artistName } = req.query;
    const artist = await Music.find({
      artistName: { $regex: `.*${artistName}*.` },
    });

    if (artist.length > 0) {
      res.json(artist);
    } else {
      res.status(404).json("artist not found");
    }
  } catch (err) {
    res.status(404).json({ error: "Invalid id" });
  }
});

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "No internet" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

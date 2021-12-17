import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

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

app.get("/music/id/:id", async (req, res) => {
  try {
    MusicList.findOne({ id: req.params.id }).then((id) => {
      if (id) {
        res.json(id);
      } else {
        res.status(404).json("music id not found");
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
    res.status(404).json({ error: "no slow track found" });
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
    res.status(404).json({ error: "no disco track found" });
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
    res.status(404).json({ error: "popular track not found" });
  }
});

app.get("/music/unpopular", async (req, res) => {
  try {
    const unPopular = await MusicList.find().limit(1).lt("popularity", 80);
    if (unPopular) {
      res.json(unPopular);
    } else {
      res.status(404).json("could not found that unpopular track");
    }
  } catch (err) {
    res.status(404).json({ error: "unpopular track not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

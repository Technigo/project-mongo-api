import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import topMusicData from "./data/top-music.json";

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://nini:xtOdkZULCSOCks7Y@cluster0.6qmgj.mongodb.net/projectMongo?retryWrites=true&w=majority";
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

// Our own middleware checks if the database is connected before going forward to our endpoints.
// is the server up and running?
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

const Tracks = mongoose.model("Tracks", {
  index: Number,
  title: String,
  artist: String,
  genre: String,
  year: Number,
  bpm: Number,
  energy: Number,
  danceability: Number,
  dB: Number,
  liveness: Number,
  valence: Number,
  duration: Number,
  acousticness: Number,
  speechiness: Number,
  pop: Number,
});

if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Tracks.deleteMany({});

    topMusicData.forEach((item) => {
      const newTrack = new Tracks(item);
      newTrack.save();
    });
  };

  seedDataBase();
}

// Defining routes starts here
app.get("/", (req, res) => {
  res.send(
    "Hello music lover! Go to /endpoints to see the possible endpoints. Remember that the endpoints are case sensitive."
  );
});
// See all possible endpoints
app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app));
});

// get the songs from the database (not a local file).
// .find is a mongoose soultion. it can take a while and need async and await.
app.get("/songs", async (req, res) => {
  let songs = await Track.find(req.query);
  if (songs) {
    // greater than-filter songs by bpm.
    // Example: songs/?bpm=110 will show all songs with a bom of 10 or higher.
    if (req.query.bpm) {
      const songsByBpm = await Track.find().gt("bpm", req.query.bpm);
      songs = songsByBpm;
    }
    res.json(songs);
  } else {
    res.status(404).json({ error: "Song not found" });
  }
});

// Get track by id. We use this to find only one result. findById is a mongoose-thing.
// try and catch will catch unexpected errors and prevent the database from thinking forever.
app.get("/songs/id/:id", async (req, res) => {
  try {
    const songById = await Track.findById(req.params.id);
    if (songById) {
      res.json(songById);
    } else {
      res.status(404).json({ error: "Sorry, a song by this id is not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "The id is invalid" });
  }
});

// get song by title.
app.get("/songs/title/:trackName", async (req, res) => {
  try {
    const songByTitle = await Track.findOne({
      trackName: req.params.trackName,
    });
    if (songByTitle) {
      res.json(songByTitle);
    } else {
      res.status(404).json({ error: "Song title not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Song title is not valid" });
  }
});

// Get artist.
app.get("/songs/artist/:artistName", async (req, res) => {
  const songByArtist = await Track.find({ artistName: req.params.artistName });
  if (songByArtist) {
    res.json(songByArtist);
  } else {
    res.status(404).json({ error: "The artist is not found" });
  }
});

// get a specific genre.
app.get("/songs/genre/:genre", async (req, res) => {
  const songByGenre = await Track.find({ genre: req.params.genre });
  if (songByGenre) {
    res.json(songByGenre);
  } else {
    res.status(404).json({ error: "The genre is not found" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

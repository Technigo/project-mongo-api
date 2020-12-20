import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

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
app.use(bodyParser.json());

const Track = new mongoose.model("Track", {
  trackName: String,
  artistName: String,
  genre: String,
  danceability: Number,
  popularity: Number,
});

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Track.deleteMany();

    topMusicData.forEach((item) => {
      const newTrack = new Track(item);
      newTrack.save();
    });
  };
  populateDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    `Welcome to the Top Music API with ${topMusicData.length} listed tracks.`
  );
});

app.get("/tracks", async (req, res) => {
  const allTracks = await Track.find(req.query);
  res.json(allTracks);
});

app.get("/track/:id", async (req, res) => {
  const singleTrack = await Track.findById(id);
  if (singleTrack) {
    res.json(singleTrack);
  } else {
    res.status(404).json({ error: "Invalid track id" });
  }
});

app.get("/artists/:artist/tracks", (req, res) => {
  const { artist } = req.params;
  const artistCapitalized = artist.charAt(0).toUpperCase() + artist.slice(1);
  const singleArtist = topMusicData.filter((item) =>
    item.artistName.includes(artistCapitalized)
  );
  console.log(singleArtist);
  if (singleArtist.length === 0) {
    res.status(404).json({ error: "Artist not found" });
  } else {
    res.json(singleArtist);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

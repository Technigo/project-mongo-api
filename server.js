import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

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

const MusicData = mongoose.model("MusicData", {
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

/* spara ny data */
/* if  för att undvika att datasetet dubbliseras */
if (process.env.RESET_DB) {
  const seedData = async () => {
    await MusicData.deleteMany({});

    topMusicData.forEach((item) => {
      const newMusicData = new MusicData(item);
      newMusicData.save();
    });
  };

  seedData();
}
// get full dataset
app.get("/", (req, res) => {
  res.send(topMusicData);
});

app.get("/artist/:artist", (req, res) => {
  const { artist } = req.params;
  const { track } = req.query;

  let artistData = topMusicData.filter(
    (item) => item.artistName.toLowerCase() === artist.toLowerCase()
  );

  if (track) {
    /* filter artists tracks to find one specific song*/
    let nameArtistTrack = artistData.find(
      (item) => item.trackName.toLowerCase() === track.toLowerCase()
    );

    /* if track not exist in the dataset */

    if (!nameArtistTrack) {
      res.status(400).json({
        response: "no track",
        success: false
      });
    } else {
      /* 200 - success to get data, gives back searched track(one object due to find filtration of nameArtist) from an artists tracklist*/
      res.status(200).json({
        response: nameArtistTrack,
        success: true
      });
    }
  } else if (artist) {
    if (artistData.length === 0) {
      /* if artist not exist in the dataset */
      res.status(400).json({
        response: "Artist not found",
        success: false
      });
    } else {
      /* 200 - success to get data, gives back searched track(one object due to find filtration of nameArtist) from an artists tracklist*/
      res.status(200).json({
        response: artistData,
        success: true
      });
    }
  } else {
    /* server cant send data */
    res.status(404).json({
      response: "404 Not Found",
      success: false
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

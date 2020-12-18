import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import spotifyData from "./data/spotify-releases.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-spotify-v2"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9100
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Release = new mongoose.model("Release", {
  album_type: String,
  // artists: [{ external_urls: { spotify: String }, name: String }],
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist"
    }
  ],
  external_urls: { spotify: String },
  images: [{ height: Number, url: String, width: Number }],
  name: String,
  release_date: String,
  total_tracks: Number
});

const Artist = new mongoose.model("Artist", {
  external_urls: { spotify: String },
  name: String
});

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Artist.deleteMany();
    await Release.deleteMany();

    // let artists = [];

    // const spotifyArtists = spotifyData.map(item => item.artists.map(artist =))
    spotifyData.forEach(async item => {
      item.artists.forEach(item => {
        const newArtist = new Artist(item);
        // artists.push(newArtist);
        await newArtist.save();
      })
    })

    spotifyData.forEach(async releaseItem => {
      const newRelease = new Release({
        ...releaseItem,
        // artists: artists.find(artist => artist.name === releaseItem.)
      })
      new newRelease.save();
    })
  }
  populateDatabase();
};

// error message
const ERROR_RELEASES_NOT_FOUND = { error: "No release matched your request" };

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to the Spotify Releases API")
})

// This route will return a collection of releases
app.get("/releases", async (req, res) => {
  const allReleases = await Release.find(req.query);
  if (allReleases.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: allReleases.length,
      releases: allReleases
    });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

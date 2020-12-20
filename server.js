import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import spotifyData from "./data/spotify-releases.json";
import spotifyTypes from "./data/spotify-types.json";
import spotifyArtists from "./data/spotify-artists.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-spotify"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Release = new mongoose.model("Release", {
  album_type: String,
  artists: [{ external_urls: { spotify: String }, href: String, id: String, name: String, artist_type: String, uri: String }],
  available_markets: [String],
  external_urls: { spotify: String },
  href: String,
  id: String,
  images: [{ height: Number, url: String, width: Number }],
  name: String,
  release_date: String,
  release_date_precision: String,
  total_tracks: Number,
  type: String,
  uri: String
});

const Type = new mongoose.model("Type", {
  album_type: String,
});

const Artist = new mongoose.model("Artist", {
  external_urls: { spotify: String },
  href: String,
  id: String,
  name: String,
  artist_type: String,
  uri: String,
  release_id: String
});

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Type.deleteMany();
    await Artist.deleteMany();
    await Release.deleteMany();

    let types = [];

    spotifyTypes.forEach(async item => {
      const newType = new Type(item);
      types.push(newType);
      await newType.save();
    });

    let artists = []

    spotifyArtists.forEach(async item => {
      const newArtist = new Artist(item);
      artists.push(newArtist);
      await newArtist.save();
    });

    spotifyData.forEach(async releaseItem => {
      // const newRelease = new Release({
      //   ...releaseItem,
      //   album_type: types.find(typeItem => typeItem.album_type === releaseItem.album_type)
      // });
      const newRelease = new Release(releaseItem)
      await newRelease.save();
    });
  }
  populateDatabase();
};

// error message
const ERROR_RELEASES_NOT_FOUND = { error: "No release matched your request" };

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to the Spotify Releases API")
});

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
});

// This route will return a single release based on id
app.get("/releases/:id", async (req, res) => {
  const release = await Release.findOne({ id: req.params.id });
  if (!release) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json(release);
  }
});

// This route will return a collection of releases with an artist name containing the specified word(s)
app.get("/releases/artist/:artist", async (req, res) => {
  const artistQuery = await Release.find({
    artists: { $elemMatch: { name: new RegExp(req.params.artist, "i") } }
  })
  if (artistQuery.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: artistQuery.length,
      releases: artistQuery
    });
  }
});

// This route will return a collection of releases with a title containing the specified word(s) 
app.get("/releases/title/:title", async (req, res) => {
  const titleQuery = await Release.find({
    name: new RegExp(req.params.title, "i")
  })
  if (titleQuery.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: titleQuery.length,
      releases: titleQuery
    });
  }
});

// This route will return a collection of releases with a type containing the specified word(s)
app.get("/releases/type/:type", async (req, res) => {
  const typeQuery = await Release.find({
    album_type: new RegExp(req.params.type, "i")
  })
  if (typeQuery.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: typeQuery.length,
      releases: typeQuery
    });
  }
});

// This route will return a collection of releases in the specified market for the specified type
app.get("/releases/market/:market/type/:type", async (req, res) => {
  const filteredReleases = await Release.find({
    available_markets: req.params.market,
    album_type: req.params.type
  })
  if (filteredReleases.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: filteredReleases.length,
      releases: filteredReleases
    });
  };
});

// This route will return a list of all available release types.
app.get("/types", async (req, res) => {
  const allTypes = await Type.find();
  if (allTypes.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: allTypes.length,
      releases: allTypes
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

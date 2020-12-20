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
  // album_type: String,
  album_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type"
  },
  // artists: [{ external_urls: { spotify: String }, href: String, id: String, name: String, artist_type: String, uri: String }],
  artists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist"
    }
  ],
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

    let listOfArtists = []

    spotifyArtists.forEach(async item => {
      const newArtist = new Artist(item);
      listOfArtists.push(newArtist);
      await newArtist.save();
    });

    spotifyData.forEach(async releaseItem => {
      const newRelease = new Release({
        ...releaseItem,
        album_type: types.find(typeItem => typeItem.album_type === releaseItem.album_type),
        artists: listOfArtists.filter(artistItem => artistItem.release_id === releaseItem.id)
      });
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
  const allReleases = await Release.find(req.query).populate("album_type").populate("artists");
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
  const release = await Release.findOne({ id: req.params.id }).populate("album_type").populate("artists");
  if (!release) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json(release);
  }
});

// This route will return a collection of releases with an artist name containing the specified word(s)
app.get("/releases/artist/:artist", async (req, res) => {
  // The function below was used when the artists were embedded sub-documents
  // const artistQuery = await Release.find({
  //   artists: { $elemMatch: { name: new RegExp(req.params.artist, "i") } }
  // })

  // This function works when the artists are stored in the separate collection artists
  // and referenced in the collection releases.
  const artistQuery = await Release.aggregate([
    {
      $unwind: "$artists"
    },
    {
      $lookup: {
        from: "artists",
        localField: "artists",
        foreignField: "_id",
        as: "artists"
      }
    },
    {
      $lookup: {
        from: "types",
        localField: "album_type",
        foreignField: "_id",
        as: "album_type"
      }
    },
    {
      $match: {
        "artists.name": new RegExp(req.params.artist, "i")
      }
    }
  ]);

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
  }).populate("album_type").populate("artists")
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
  const typeQuery = await Release.aggregate([
    {
      $lookup: {
        from: "types",
        localField: "album_type",
        foreignField: "_id",
        as: "album_type"
      }
    },
    {
      $lookup: {
        from: "artists",
        localField: "artists",
        foreignField: "_id",
        as: "artists"
      }
    },
    {
      $match: {
        "album_type.album_type": new RegExp(req.params.type, "i")
      }
    }
  ]);
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
  const filteredReleases = await Release.aggregate([
    {
      $lookup: {
        from: "types",
        localField: "album_type",
        foreignField: "_id",
        as: "album_type"
      }
    },
    {
      $lookup: {
        from: "artists",
        localField: "artists",
        foreignField: "_id",
        as: "artists"
      }
    },
    {
      $match: {
        $and: [
          { "album_type.album_type": new RegExp(req.params.type, "i") },
          { available_markets: req.params.market }
        ]
      }
    }
  ]);
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
      types: allTypes
    });
  }
});

// This route will return a list of all available artists.
app.get("/artists", async (req, res) => {
  const allArtists = await Artist.find();
  if (allArtists.length === 0) {
    res.status(404).json(ERROR_RELEASES_NOT_FOUND);
  } else {
    res.json({
      total: allArtists.length,
      artists: allArtists
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

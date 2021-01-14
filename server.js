import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import albumData from "./data/rolling-stone-top-500-albums.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Album = new mongoose.model("Album", {
  position: Number,
  artist: String,
  albumName: String,
  label: String,
  year: Number,
  critic: String,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Album.deleteMany(); // deleteMany and save are methods provided by Mongoose package

    albumData.forEach(item => {
      const newAlbum = new Album(item);
      newAlbum.save();
    });
  };
  seedDatabase();
}

const port = process.env.PORT || 8082;
const app = express();
const listEndpoints = require("express-list-endpoints");

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: `Service unavailable` });
  }
});

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/albums", async (req, res) => {
  const allAlbums = await Album.find(req.query); // Clean way of setting queries. This allows all database fields to be queries
  if (allAlbums) {
    res.status(200).json({
      numberOfResults: allAlbums.length,
      results: allAlbums,
    });
  } else {
    res.status(404).send({ error: `No albums found` });
  }
});

app.get("/albums/:position", async (req, res) => {
  const { position } = req.params;
  const singleAlbum = await Album.findOne({ position: +position });
  if (singleAlbum) {
    res.status(200).json(singleAlbum);
  } else {
    res.status(404).send({ error: `No album found for position: ${position}` });
  }
});

app.get("/albumid/:id", async (req, res) => {
  try {
    const albumById = await Album.findById(req.params.id);
    if (albumById) {
      res.status(200).json(albumById);
    } else {
      res.status(404).json({ error: `Album not found` });
    }
  } catch (err) {
    res.status(400).json({ error: `Invalid album id` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

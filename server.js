import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import musicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// TopMusic model
const TopMusic = mongoose.model('TopMusic', {
  id: Number,
  trackName: {
    type: String,
    lowercase: true
  },
  artistName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    lowercase: true

  },
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  lenght: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});

// Artist model
const Artist = mongoose.model('Artist', {
  artistName: String
});

// seed DB
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await TopMusic.deleteMany();
    await Artist.deleteMany();

    const artistsArray = [];

    musicData.forEach(async (item) => {
      const newArtist = new Artist(item);
      artistsArray.push(newArtist);
      await newArtist.save();
    });

    musicData.forEach(async (item) => {
      const newTopMusic = new TopMusic({
        ...item,
        artistName: artistsArray.find(
          (singleArtist) => singleArtist.artistName === item.artistName
        )
      });
      await newTopMusic.save();
    });
  };
  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// check connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service not available" });
  }
});

// show all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// GET - get all tracks
app.get('/tracks', async (req, res) => {
  const { trackName } = req.query;
  try {
    if (trackName) {
      const tracks = await TopMusic.find({
        trackName: {
          $regex: new RegExp(trackName, "i")
        }
      }).populate('artistName')
      res.json(tracks);
    } else {
      const tracks = await TopMusic.find().populate('artistName');
      res.json(tracks);
    }
  } catch (error) {
    res.status(400).json({ error: "invalid request" });
  }
});

// GET - find track by id 
app.get('/tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const singleTrack = await TopMusic.findOne({ id }).populate('artistName');
    if (singleTrack) {
      res.json(singleTrack);
    } else {
      res.status(404).send({ error: "Id not found" });
    }
  } catch (err) {
    res.status(400).send({ error: "Invalid request" });
  }
});

// GET - get all artists
app.get('/artists', async (req, res) => {
  try {
    const artist = await Artist.find()
    if (artist) {
      res.json(artist);
    } else {
      res.status(404).send({ error: `Artists not found` });
    }
  } catch (err) {
    res.status(400).send({ error: "invalid request" });
  }
});

// GET - find artist by Id
app.get('/artists/:id', async (req, res) => {
  const { id } = req.params
  try {
    const singleArtist = await Artist.findById({ _id: id })
    if (singleArtist) {
      res.json(singleArtist);
    } else {
      res.status(404).send({ error: `Artist ${id} not found` });
    }
  } catch (err) {
    res.status(400).send({ error: "invalid request" });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express(); 

const Song = mongoose.model('Song', {
  "id": Number,
  "trackName": String,
  "artistName": String,
  "genre": String,
  "bpm": Number,
  "energy": Number,
  "danceability": Number,
  "loudness": Number,
  "liveness": Number,
  "valence": Number,
  "length": Number,
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
})

//Deleting everything in our database: an empty pattern - never use in production code, only for educational purposes
//to prevent adding several duplicates of data objects to database for every reload of server
//create a function that check if we want to reset our database, which will be dependent on env variable, then will delete everything

//provide RESET_DB=true npm run dev for start in terminal
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    //async will tell us to wait for a piece of code before we do anything else
    //await for whole collection to be deleted
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
    //normally when wanting to delete something, specify (requirements)
  }
  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const routes = {
    '[GET] all songs route': "/songs",
    '[GET] artistName route': "/songs/song/:artistName",
    '[GET] genre route': "/songs/:genre"
  }
  res.send(routes);
});

app.get("/songs", async (req, res) => {
  try {
    const allSongs = await Song.find();
    res.status(200).json(allSongs);
  } catch(err) {
    res.status(400).json({error: 'Not found'});
  }
})

app.get("/songs/song/:artistName", async (req, res) => {
  const singleSong = await Song.findOne({artistName: req.params.artistName});
  
  if (singleSong) {
    res.send(singleSong);
  } else {
    res.status(404).json({error: 'Not found'})
  }
})

app.get("/songs/:genre", async (req, res) => {
  const songGenres = await Song.find({genre: req.params.genre});
  
  if (songGenres) {
    res.send(songGenres);
  } else {
    res.status(404).json({error: 'Not found'})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

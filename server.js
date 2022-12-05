import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
/*mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log("mongdb is connected")
  }
})*/


const Song = mongoose.model("Song", {
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


if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// Main route
app.get("/", (req, res) => {
  res.json({ 
    responseMessage: "Hi, let's look at some music!",
    routes: {
      "/songs": "shows all songs",
      "/songs?genre= add genre": "a specific genre",
      "/songs?artistName= add name of artist" : "songs by a specific artist", 
      "/songs/:id": "songs by its unique id"
    }
  } );
});

// All songs (genre, danceability, artist)
app.get("/songs/", async (req, res) => {

  const {genre, artistName, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const genreQuery = genre ? genre : {$regex: matchAllRegex,  $options: 'i' };
  const artistQuery = artistName ? artistName : {$regex: matchAllRegex, $options: 'i'};
  const danceabilityQuery = danceability ? danceability : {$regex: matchAllRegex, $options: 'i'};

  try {
      response.body = await Song.find({genre: genreQuery, artistName: artistQuery, danceability: danceabilityQuery})
   
    res.status(200).json({
      success: true,
      body: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }

});

// Find specific song with id
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

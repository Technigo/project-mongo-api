import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start


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
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// If connection to server is down, show below and don't move to routes
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ 
      status_code: 503,
      error: "Server unavailable" })
  }
})

// Startpage with route info
app.get("/", (req, res) => {
  res.send({
    Welcome: "Browse songs and artists 🎵 Below is the endpoints you can use to display data.",
    Routes: [
      {
        "/songs": "Show all songs.",
        "/songs/:id": "Show info about specific song by mongo id.",
        "/tracks/:trackName": "Search info about track by name. Ex 'boyfriend' will give all tracks with word boyfriend in",
        "/artists/:artistName": "Show all songs by an artist. Ex 'Ed Sheeran' (--matches like above)",
        "/genres/:genre": "See songs and artists by genre. Ex 'pop' (--matches like above)",
      },
    ]});
});

// All songs
app.get("/songs", async (req,res) => {
  await Song.find().then(songs => {
     res.status(200).json({
      success: true,
      data: songs
     })
   })
 })

// Find songinfo by id
app.get("/songs/:id", async (req, res) => {
  try {
    const songId = await Song.findById(req.params.id);

    if (songId) {
      res.status(200).json({
      success: true,
      data: songId
    })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        error: `Id not found, try another`
    })
    }
  } catch (err) {
    res.status(400).json({ 
      success: false,
      status_code: 400,
      error: "Invalid id" 
    })
  }

})


// Find a song by name
// The RegExp with "i" makes it possible to search case-insensitive and shows all data which includes what you type. Like "beautiful" gives you all tracks that include the word "beautiful"
app.get("/tracks/:trackName", async (req, res) => {
  try {
    const theTrackName = await Song.findOne({ trackName: new RegExp(req.params.trackName, "i") })
    if (theTrackName) {
      res.status(200).json({
      success: true,
      data: theTrackName
    })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        error: `No track with that name was found, try another`
    })
    }
  } catch (err) {
    res.status(400).json({ 
      success: false,
      status_code: 400,
      error: "Invalid name" 
    })
  }

})

// Find list of artists songs. 
app.get("/artist/:artistName", async (req, res) => {
  try {
    const artistSongs = await Song.find({ artistName: new RegExp(req.params.artistName, "i") })
    if (artistSongs) {
      res.status(200).json({
      success: true,
      data: artistSongs
    })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        error: `No artists with that name was found, try another`
    })
    }
  } catch (err) {
    res.status(400).json({ 
      success: false,
      status_code: 400,
      error: "Invalid name" 
    })
  }

})

// Find all songs within a specific genre
app.get("/genres/:genre", async (req, res) => {
  try {
    const genreList = await Song.find({ genre: new RegExp(req.params.genre, "i") })
    if (genreList) {
      res.status(200).json({
      success: true,
      data: genreList
    })
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        error: `No genre with that name was found, try another`
    })
    }
  } catch (err) {
    res.status(400).json({ 
      success: false,
      status_code: 400,
      error: "Invalid genre" 
    })
  }

})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




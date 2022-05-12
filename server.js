import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8090;
const app = express()

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

const Song = mongoose.model("song", {
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
})

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany()
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong)
      newSong.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req, res) => {
  const landingPage = {
    Welcome: "Welcome! This is an open API for Top Music!",
    Routes: [
      {
        "/endpoints": "List of endpoints",
        "/songs": "Get the Top Music List",
        "/songs/id/:id": "Get a unique song by id",
        "/songs/song/:artistName": "Get songs by artistname",
        "/songs/song?trackName='title of track'": "Get song by trackname",
        "/songs/song?artistName='name of artist'": "GET songs by artistname",
      },
    ],
  }
  res.send(landingPage);
})

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app));
})

app.get("/songs", async (req, res) => {
  const allSongs = await Song.find()
  res.json(allSongs)
})

//Path params
app.get("/songs/id/:id", async (req, res) => {
  //findOne() will retrieve first object with given criteria
     const songById = await Song.findOne({id: req.params.id})
  
     if (songById) {
       res.status(200).json ({
         data: songById,
         success: true,
       })
     } else {
       res.status(404).json({
         data: "Song not found",
         success: false,
       })
     }
   })

app.get("/songs/artist/:artistName", async (req, res) => {
//find() will retrieve array of songs with given criteria
   const songByArtist = await Song.find({artistName: req.params.artistName})

   if (songByArtist) {
     res.status(200).json ({
       data: songByArtist,
       success: true,
     })
   }
 })

//Path with query 
app.get("/songs/song", async (req, res) => {
  const { artistName, trackName}  = req.query
  if (trackName) {
    const songByTrack = await Song.find({trackName: trackName})
    res.send(songByTrack)
  } else {
      const singleSong = await Song.find({artistName: artistName})
      res.send(singleSong)
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

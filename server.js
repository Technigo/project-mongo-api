import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import topMusicData from "./data/top-music.json"


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-tiiliu"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()


const Track = mongoose.model("Track", {
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

if (process.env.RESET_DB) {

  // Only for setting things up locally
  const seedDatabase = async () => {
    await Track.deleteMany({})

    topMusicData.forEach((track) => {
      const newTrack = new Track(track)
      newTrack.save()
    })
  }
  seedDatabase()
}


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: "Service unavailable",
    })
  }
})


// Description for the routes
app.get("/", (req, res) => {
  res.send({
    "Top Music API":"Serving you info about Spotifys top tracks",
    "Routes":[{
      "/tracks":"Get all tracks",
      "/tracks/high-tempo":"Get all tracks with high tempo",
      "/tracks/danceable":"Get all tracks which are danceable",
      "/tracks/random-track":"Get a random track",
      "/tracks/genres/:genre":"Get tracks by genre (for example: /tracks/genres/latin)",
      "/tracks/artists/:artist":"Get a track by the artists name (for example: /tracks/artists/ed sheeran)",
      "/tracks/songtitles/:songtitle":"Get a specific track by the songtitle (for example: /tracks/songtitles/truth hurts)",
      "/tracks/id/:id":"Get a track by _id (for example: /tracks/id/6283e58592aafedccbeb0e0e)",
      "/tracks?genre=${genre}":"Get tracks by genre (for example: /tracks?genre=hip hop)",
      "/tracks?artist=${artist}":"Get all tracks from a specific artist (for example: /tracks?artist=billie eilish)",
      "/tracks?songtitle=${songtitle}":"Get a specific track by the songtitle (for example: /tracks?songtitle=shallow)"
    }]
  })
})


// get all tracks
app.get("/tracks", async (req, res) => {
  try {
    const allTracks = await Track.find().sort({id:1})
    res.status(200).json({
      data: allTracks,
      succes: true
    })
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get tracks by genre OR get tracks by artist name OR get tracks by songtitle
app.get("/tracks", async (req, res) => {
  try { 
    let tracks = await Track.find(req.query)

    if (req.query.genre) {
      const tracksByGenre = await Track.find({
        genre: new RegExp(req.query.genre, "i")
      })
      tracks = tracksByGenre
    }

    if (req.query.artist) {
      const tracksByArtist = await Track.find({
        artistName: new RegExp(req.query.artist, "i")
      })
      tracks = tracksByArtist
    }

    if (req.query.songtitle) {
      const tracksBySongtitle = await Track.find({
        trackName: new RegExp(req.query.songtitle, "i")
      })
      tracks = tracksBySongtitle
    }

    res.status(200).json({
      data: tracks,
      success: true
    })
    } catch(err) {
      res.status(400).json({
        error: "Invalid request",
        success: false
      })
    }
})


// get all tracks with high-tempo, ie. tracks with bpm >= 120
app.get("/tracks/high-tempo", async (req, res) => {
  try {
    const tracksWithHighTempo = await Track.find({
      bpm: { $gte: 120 }
    })
    res.status(200).json({
      data: tracksWithHighTempo,
      success: true
    })
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get all danceable tracks, ie tracks with danceability >= 60
app.get("/tracks/danceable", async (req, res) => {
  try {
    const danceableTracks = await Track.find({
      danceability: { $gte: 60 }
    })
    res.status(200).json({
      data: danceableTracks,
      success: true
    })
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get tracks by genre
app.get("/tracks/genres/:genre", async (req, res) => {
  try {
    const { genre } = req.params
    const tracksByGenre = await Track.find({
      genre: new RegExp(genre, "i")
    })
    if (tracksByGenre) {
      res.status(200).json({
        data: tracksByGenre,
        success: true
      })
    } else {
      res.status(404).json({
        data: "Sorry, genre not found",
        success: false
      })
    }
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get tracks by artist name
app.get("/tracks/artists/:artist", async (req, res) => {
  try {
    const { artist } = req.params
    const tracksByArtist = await Track.find({
      artistName: new RegExp(artist, "i")
    })
    if (tracksByArtist) {
      res.status(200).json({
        data: tracksByArtist,
        success: true
      })
    } else {
      res.status(404).json({
        data: "Sorry, artist not found",
        success: false
      })
    }
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get tracks by songtitle
app.get("/tracks/songtitles/:songtitle", async (req, res) => {
  try {
    const { songtitle } = req.params
    const singleTrack = await Track.findOne({
      trackName: new RegExp(songtitle, "i")
    })
    if (singleTrack) {
      res.status(200).json({
        data: singleTrack,
        success: true
      })
    } else {
      res.status(404).json({
        data: "Sorry, song not found",
        success: false
      })
    }
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// get a single track based on database id
app.get("/tracks/id/:id", async (req, res) => {
  try {
    const trackById = await Track.findById(req.params.id)
    if (trackById) {
      res.status(200).json({
        data: trackById,
        success: true
      })
    } else {
      res.status(404).json({
        data: "Sorry, this id could not be found",
        success: false
      })
    }
  } catch(err) {
    res.status(400).json({
      error: "Invalid id",
      success: false
    })
  } 
})

app.get("/tracks/random-track", async (req, res) => {
  try {
    const randomTrack = await Track.findOne({
      id: Math.floor(Math.random() * 50) + 1
    })
    res.status(200).json({
      data: randomTrack,
      success: true
    })
  } catch(err) {
    res.status(400).json({
      error: "Invalid request",
      success: false
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


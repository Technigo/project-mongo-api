import express from "express"
import cors from "cors"
import mongoose from "mongoose"

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

import spotifyTopTracks from "./data/top-tracks.json"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/top-tracks-project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const Tracks = mongoose.model("Tracks", {
  index: Number,
  title: String,
  artist: String,
  genre: String,
  year: Number,
  bpm: Number,
  energy: Number,
  danceability: Number,
  dB: Number,
  liveness: Number,
  valence: Number,
  duration: Number,
  acousticness: Number,
  speechiness: Number,
  pop: Number,
})

//resets database by first deleting the previous data with deletemany({}) and then it sets the new data through save() function to avoid duplication of the data everytime the database updates.
if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Tracks.deleteMany({})

    spotifyTopTracks.forEach((item) => {
      const newTrack = new Tracks(item)
      newTrack.save()
    })
  }

  seedDataBase()
}

// Start defining your routes here

app.get("/", (req, res) => {
  res.send(
    "This is my spotify top tracks from the billboard between 2010 - 2019. Type the endpoint /tracks to get the total data to get started!"
  )
})

app.get("/tracks", (req, res) => {
  Tracks.find().then((tracks) => {
    res.json(tracks)
  })
})

app.get("/tracks/index/:index", (req, res) => {
  Tracks.findOne({ index: req.params.index }).then((index) => {
    if (index) {
      res.json(index)
    } else {
      res.status(404).json({ error: "no track found with that index number" })
    }
  })
})

app.get("/tracks/title/:title", (req, res) => {
  Tracks.findOne({ title: req.params.title }).then((title) => {
    if (title) {
      res.json(title)
    } else {
      res.status(404).json({ error: "title not found" })
    }
  })
})

app.get("/tracks/artists/:artist", (req, res) => {
  Tracks.find({ artist: req.params.artist }).then((artist) => {
    if (artist) {
      res.json(artist)
    } else {
      res.status(404).json({ error: "no track with that bpm found" })
    }
  })
})

app.get("/tracks/year/:year", (req, res) => {
  Tracks.find({ year: req.params.year }).then((year) => {
    if (year) {
      res.json(year)
    } else {
      res.status(404).json({ error: "titles not found on this year" })
    }
  })
})

app.get("/tracks/genre/:genre", (req, res) => {
  Tracks.find({ genre: req.params.genre }).then((genre) => {
    if (genre) {
      res.json(genre)
    } else {
      res.status(404).json({ error: "Genre not found" })
    }
  })
})

app.get("/tracks/bpm/:bpm", (req, res) => {
  Tracks.find({ bpm: req.params.bpm }).then((bpm) => {
    if (bpm) {
      res.json(bpm)
    } else {
      res.status(404).json({ error: "no track with that bpm found" })
    }
  })
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

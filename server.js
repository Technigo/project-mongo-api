import express from "express"
import cors from "cors"
import mongoose from "mongoose"

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
// Our own middleware that checks if the database is connected before going forward to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

app.get("/", (req, res) => {
  res.send(
    "This is my spotify top tracks from the billboard between 2010 - 2019. Type the endpoint /tracks to get the total data to get started!"
  )
})

app.get("/tracks", async (req, res) => {
  const tracks = await Tracks.find(req.query)
  res.json(tracks)
})

app.get("/tracks/index/:index", async (req, res) => {
  try {
    const index = await Tracks.findOne({ index: req.params.index })
    if (index) {
      res.json(index)
    } else {
      res.status(404).json({ error: "no track found with that index number" })
    }
  } catch (err) {
    res.status(400).json({ error: "index number is invalid" })
  }
})

app.get("/tracks/title/:title", async (req, res) => {
  try {
    const title = await Tracks.findOne({ title: req.params.title })
    if (title) {
      res.json(title)
    } else {
      res.status(404).json({ error: "title not found" })
    }
  } catch (err) {
    res.status(400).json({ error: "title is invalid" })
  }
})

app.get("/tracks/artists/:artist", async (req, res) => {
  try {
    const artist = await Tracks.find({ artist: req.params.artist })
    if (artist) {
      res.json(artist)
    } else {
      res.status(404).json({ error: "No artist found" })
    }
  } catch (err) {
    res.status(400).json({ error: "artist is invalid" })
  }
})

app.get("/tracks/year/:year", async (req, res) => {
  try {
    const year = await Tracks.find({ year: req.params.year })
    if (year) {
      res.json(year)
    } else {
      res.status(404).json({ error: "No titles found on this year" })
    }
  } catch (err) {
    res.status(400).json({ error: "year is invalid" })
  }
})

app.get("/tracks/genre/:genre", async (req, res) => {
  try {
    const genre = await Tracks.find({ genre: req.params.genre })
    if (genre) {
      res.json(genre)
    } else {
      res.status(404).json({ error: "Genre not found" })
    }
  } catch (err) {
    res.status(400).json({ error: "genre is invalid" })
  }
})

app.get("/tracks/bpm/:bpm", async (req, res) => {
  try {
    const bpm = await Tracks.find({ bpm: req.params.bpm })
    if (bpm) {
      res.json(bpm)
    } else {
      res.status(404).json({ error: "no track with that bpm found" })
    }
  } catch (err) {
    res.status(400).json({ error: "bpm is invalid" })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

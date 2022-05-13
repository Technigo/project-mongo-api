import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from 'express-list-endpoints'
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()


// model a specific set of rules, for how the document will look like
// every document created should look like this:
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
})


if(process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Song.deleteMany()
    topMusicData.forEach( singleSong => {
      const newSong = new Song (singleSong)
      newSong.save()
    })
  }
  seedDataBase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})


// Get all songs
app.get("/songs", async (req, res) => {

  try {
    let { page, size } = req.query
    if (!page) {
      page = 1
    } if (!size) {
      size = 100
    }

    const limit = parseInt(size, 100)
    const skip = (page - 1) * size

    const songs = await Song.find().limit(limit).skip(skip)
    res.send({ page, size, data: songs})
  } catch (error) {
    res.status(400).json({ error: "Error, not a page or size"})
  }
})


// Artist name
app.get("/songs/song/:artistName", async (req, res) => {
  // this will retrieve only the first found song
  const singleSong = await Song.findOne({artistName: req.params.artistName})
  res.send(singleSong)
})



// Start the server
app.listen(port, () => {
  console.log(`Hello world`)
  console.log(`Server running on http://localhost:${port}`)
})
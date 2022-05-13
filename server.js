import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import topMusicData from "./data/top-music.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
  popularity: Number,
})



const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello Technigo!")
})

app.get("/artists", async (req, res) => {
  const artists = await Song.find();
  res.json(artists);
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

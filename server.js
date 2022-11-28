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
  popularity: Number
})

const resetDataBase = async () => {
  await Song.deleteMany()
  topMusicData.forEach(singleSong => {
    const newSong = new Song(singleSong)
    newSong.save()
  })
}

if(process.env.RESET_DB) {
  resetDataBase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("See README for how to use")
})


app.get("/reset-db", async (req, res) => {
  if (req.query.hax === 'lax') {
    await resetDataBase();
    res.send("db haxxed by haxx0rz")
  }
  res.send("Wrong password")
})

app.get("/songs/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: { 
        message: "Invalid id" 
      }
    })
  }

})

app.get("/songs/", async (req, res) => {
  const {genre, danceability} = req.query
  const response = {
    success: true,
    body: {}
  }
  const genreQuery = genre ? genre : /.*/
  const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100}

  try {
      response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery}).limit(10).sort({energy: 1}).select({trackName: 1, artistName: 1, genre: 1})
    res.status(200).json({
      success: true,
      body: response
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      body: { 
        message: error 
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})



//RESET_DB=true npm run dev



//https://regex101.com/

// /yourWodOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string
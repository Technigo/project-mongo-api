import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import topMusicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Song = mongoose.model("Song", {
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
} 
)

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase()
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// endpoints 
app.get("/", (req, res) => {
  res.send({
    Message:"Welcome to Songs-API!Here are popular songs", 
    endpoints: 
      {'/songs': 'Lists all songs',
      '/songs/id/:id' : 'Filters song per id',
      '/songs/genre/:genre' : 'Lists all songs of chosen genre.'
     }
    })
});

app.get("/songs", async (req, res) => {
  const allSongs = await Song.find({})
  res.status(200).json({
    success: true,
    body: allSongs
  })
});

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id).exec();
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song. Check the id and/or try another one"
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
});

app.get("/songs/genre/:genre", async (req, res) => {
  try {
    const genreCollection = await Song.find({genre: req.params.genre}).exec();
    if (genreCollection) {
      res.status(200).json({
        success: true,
        body: genreCollection
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song. Check the id and/or try another one"
        }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid genre"
      }
    })
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

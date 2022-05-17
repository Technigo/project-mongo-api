import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express(); 

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
});

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach( singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  seedDatabase()
}

//middlewares

app.use(cors());
app.use(express.json());

//routes

app.get("/", (req, res) => {
  const welcomePage = {
    Hello:
    "Welcome to an API with the top music songs on Spotify!",
    Routes: [{
      "/songs": "Get the whole array of top songs",
      "/songs/artist/'name of artist/band": "Get the songs by a specific artist/band",
      "/songs/title/'title of song": "Get a specific song"
    }]
  }
  res.send(welcomePage);
});

//get all songs

app.get("/songs", async (req,res) => {
  const allSongs = await Song.find()
  res.json(allSongs)
})


//param paths for artist and title
app.get("/songs/artist/:artistName", async (req, res) => {
  const songByArtistName = await Song.find({artistName: req.params.artistName})

  if(songByArtistName) {
    res.status(200).json ({
      data: songByArtistName,
      success: true,
    })
  }
})

app.get("/songs/title/:trackName", async (req, res) => {
  const songByTrackName = await Song.find({trackName: req.params.trackName})

  if(songByTrackName) {
    res.status(200).json ({
      data: songByTrackName,
      success: true,
    })
  }
})


//query path for title
app.get("/songs/title", async (req, res) => {
  const { artistName, trackName } = req.query

  if (trackName) {
    const singleSong = await Song.find({trackName: trackName});
    res.send(singleSong)
  } else {
    const singleSong = await Song.find({artistName: artistName});
    res.send(singleSong)
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

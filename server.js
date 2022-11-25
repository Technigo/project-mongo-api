import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import topMusicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://Paprika:${process.env.STRING_PW}@cluster0.6gvgrxz.mongodb.net/project-mongo-api?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


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

if(process.env.RESET_DB){
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song (singleSong);
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

// Add routes here
app.get('/', (req, res) => {
  res.json({"Routes in this project": listEndpoints(app)})
})

app.get("/songs", async (req, res) => {
  const topMusicData = await Song.find({}) //to find all the songs
  res.status(200).json({
    data: topMusicData,
    success: true,
  });
});

app.get('/songs/top10', async (req, res) => {
  const { popularity } = req.params;
  const topTenHits = topMusicData.sort((a, b) => b.popularity - a.popularity) //sorts from highest rating to lowest
    res.json(topTenHits.slice(0, 10) //restricts to first 10 items
      ) 
})

app.get("/id/:id", async (req, res) => {
  const { id } = req.params
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `This id ${ id }  does not exist in the database`
        }
      });
    }
  } 
  catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: `Wrong format on entered id ${ id }`
      }
    });
  }
});

app.get("/artists/:artistName", async (req, res) => {
  const { artistName } = req.params
  try {
    const singleSongByArtist = await Song.find({ artistName })
    if (singleSongByArtist) {
      res.status(200).json({
        success: true,
        body: singleSongByArtist
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `This artist name : ${ artistName }  does not exist in the database`
        }
      });
    }
  } 
  catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: `Wrong format on the entered artist name ${ artistName }`
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

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
// The reset of database and adding new songs or albums 
// was great for educational purpose but is not to be used live.
//
// const Album = mongoose.model("Album", {
//   title: String,
//   tracks: Number,
//   song: String
// })

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
    const testSong = new Song ({ 
      id: 75,
      trackName: 'TestSong',
      artistName: 'TestArtist',
      genre: 'TestGenre',
      bpm: 190,
      energy: 70,
      danceability: 45,
      loudness: 90,
      liveness: 80,
      valence: 34,
      length: 937,
      acousticness: 23,
      speechiness: 46,
      popularity: 97
     })
    await testSong.save()

    // await new Album({ title: 'TestTitle1', tracks: 8, song: 'testSong'}).save()
    // await new Album({ title: 'TestTitle2', tracks: 8, song: 'testSong'}).save()
    // await new Album({ title: 'TestTitle3', tracks: 8, song: 'testSong'}).save()
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Top 50 songs - data",
    data: listEndpoints(app)
  });
});

app.get("/songs", async (req, res) => {
  const songs = await Song.find().sort({id: 1});
  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      topMusicData: songs
    }
  });
});

app.get("/songsOnlyTitleAndArtist", async (req, res) => {
  const songsOnlyTitleAndArtist = await Song.find().sort({id: 1}).select({trackName: 1, artistName: 1})
  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      topMusicData: songsOnlyTitleAndArtist
    }
  });
});

app.get('/song/id/:id', async (req, res) => {
  try {
    const songById = await Song.findById(req.params.id);
    if (songById) {
      res.status(200).json({
        success: true,
        message: "OK",
        body: {
          topMusicData: songById
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Song Not found",
        body: {
          topMusicData: {}
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid id",
      body: {
        topMusicData: {}
      }
    });
  }
})

app.get("/songs/bpm/:bpm", async (req, res) => {
  try {
    const songByBpm = await Song.find({ bpm: req.params.bpm });
    if (songByBpm) {
      res.status(200).json({
        succes: true,
        message: "OK",
        body: {
          topMusicData: songByBpm
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Track not found",
        body: {
          topMusicData: {}
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid bmp",
      body: {
        topMusicData: {}
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

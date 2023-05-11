import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json"

// This is where the application is connecting to the MongoDB database.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// creating a Mongoose Schema and model ( the wrapper on the mongoose schema that adds funtionality to it  )

const SongSchema = new mongoose.Schema({
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
// model
const Song = mongoose.model("Song", SongSchema);

// Resetting the Database
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();

    for (let song of topMusicData) {
      const newSong = new Song(song);
      await newSong.save();
    }

  };
  resetDatabase();
};

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=8080 npm start
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use ((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
 
  } else {
    res.status(503).json ({ error: 'Service unavailable'})
  }
})


// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the music API',
    routes: [
      {
        path: '/songs',
        description: 'Get all songs',
        method: 'GET',
        queryParameters: [
          {
            name: 'genre',
            description: 'Filter songs by genre'
          },
          {
            name: 'danceability',
            description: 'Filter songs by danceability score (greater than or equal to the specified value)'
          }
        ]
      },
      {
        path: '/songs/:id',
        description: 'Get a single song by ID',
        method: 'GET',
        pathParameters: [
          {
            name: 'id',
            description: 'ID of the song (number between 1 and 50)'
          }
        ]
      }
    ]
  });
});

// Get all songs route

app.get("/songs", async (req, res) => {
  const {genre, danceability } = req.query;
  const response = {
    success: true,
    body:{}
  }
  const genreRegex = new RegExp(genre);
  const danceabilityQuery =  { $gt: danceability ? danceability : 0 }

  try {
    const searchResultFromDB = await Song.find({genre: genreRegex, danceability: danceabilityQuery})
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json(response)
    }
  } catch(e) {
    response.success = false,
    res.status(500).json(response)
  }
});


// Get a single song by ID route
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findOne({ id: req.params.id })
    if (singleSong) {
      res.status(200).json ({
        success:true,
        body: singleSong
      })
    } else {
      res.status(404).json ({
        success:false,
        body: {
          message: "Song not found"
        }
      })
    }
  } catch (e) {
    res.status(500).json ({
      success:false,
      body: {
        message: "Server error "
      }
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

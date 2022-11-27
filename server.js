import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started! 
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const User = mongoose.model("User", {
  name: String,
  age: Number,
  deceased: Boolean
});

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
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
    // await User.deleteMany();
    // const testUser = new User({name: "Amanda", age: 31, deceased: false});
    // testUser.save();
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
  res.send("Hello Technigo! :D");
});

app.get("/songs", async (req, res) => {
  const allTheSongs = await Song.find({});
  res.status(200).json({
    success: true,
    body: allTheSongs
  })
});

app.get("/songs/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: { 
        message: "Invalid id" 
      }
    });
  }

});
app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) => {
  const response = {
    success: true,
    body: {}
  }
  try {
    if (req.params.genre && req.params.danceability) {
      const allMatchingSongs = await Song.find({genre: req.params.genre, danceability: req.params.danceability});
      res.status(200).json({
        success: true,
        body: allMatchingSongs
      });
    } else if (req.params.genre && !req.params.danceability) {
        const allMatchingSongs = await Song.find({genre: req.params.genre});
        res.status(200).json({
          success: true,
          body: allMatchingSongs
        });
    } else if (!req.params.genre && req.params.danceability) {
        const allMatchingSongs = await Song.find({danceability: req.params.danceability});
        res.status(200).json({
          success: true,
          body: allMatchingSongs
        });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: { 
        message: error 
      }
    });
  }

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
//C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="c:\data\db

//import topMusicData from "./data/top-music.json";
//127.0.0.1:27017
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});
const { Schema } = mongoose;
/* const netflixSchema = new Schema ({
  name: String,
  age: Number,
  alive: Boolean
});

const User = mongoose.model("User", userSchema); */

const songSchema = new Schema({
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

const Song = mongoose.model("Song", songSchema);

app.get("/songdata", async (req, res) => {
  try {
    const songList = await Song.find(req.params);
    if (songList) {
      res.status(200).json({
        success: true,
        body: songList
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/songdata/artists", async (req, res) => {
  try {
    const artistList = await Song.find({}, { artistName: 1, _id: 0 });
    if (artistList) {
      res.status(200).json({
        success: true,
        body: artistList
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Data not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});


/* app.get("/songdata/artists", async (req, res) => {
  try {
    const artistList = await Song.distinct("artistName");
    console.log(artistList)
    if (artistList.length > 0) {
      res.status(200).json({
        success: true,
        body: artistList
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Data not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
}); */

app.get("/songdata/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
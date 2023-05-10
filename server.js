import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
  res.send(
    {
      Hello: "Welcome to this top-music API!",
      Routes: [
        { "/": "Startpage / Api Info" },
        { "/allsongs": "all tracks-data" },
        { "/songs/id/:id": "singel track" },
        { "/songs": " first 5 songs (5 per page)" },
        { "/songs?page=2&pageSize=5": "page 2 (5 per page)" },
      ]
    });
});
const { Schema } = mongoose;

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

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findOne({ id: req.params.id });
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});


app.get("/allsongs", async (req, res) => {
  try {
    const allSongs = await Song.find();
    res.status(200).json({
      success: true,
      body: allSongs
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Define a GET endpoint that listens for requests to /songs
app.get("/songs", async (req, res) => {
  try {
    // Get the requested page number from the query parameter "page" (default to 1 if not provided)
    const page = parseInt(req.query.page) || 1;
    // Get the requested page size from the query parameter "pageSize" (default to 10 if not provided)
    const pageSize = parseInt(req.query.pageSize) || 10;
    // Query the Song collection, skipping (page-1)*pageSize documents and limiting the result to pageSize documents
    const songs = await Song.find().skip((page - 1) * pageSize).limit(pageSize);
    // Send a success response with the queried songs as the response body
    res.status(200).json({
      success: true,
      body: songs
    });
  } catch (e) {
    // If an error occurs, send a 500 response with the error message as the response body
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
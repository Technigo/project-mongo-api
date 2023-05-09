import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

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
const listEndPoints = require('express-list-endpoints');

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable"})
  }
}
)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(process.env.API_KEY)
  res.json(listEndPoints(app));
});

const { Schema } = mongoose;
const userSchema = new Schema ({
  name: String,
  age: Number,
  alive: Boolean
});

const User = mongoose.model("User", userSchema);

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
} catch(err) {
  res.status(500).json({
    success: false,
    body: {
      message: "invalid song id"
    }
  })
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

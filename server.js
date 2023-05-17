import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;
const dataSchema = new Schema ({
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
// const Song = mongoose.model('Song', {
//   id: Number,
//   trackName: String,
//   artistName: String,
//   genre: String,
//   bpm: Number,
//   energy: Number,
//   danceability: Number,
//   loudness: Number,
//   liveness: Number,
//   valence: Number,
//   length: Number,
//   acousticness: Number,
//   speechiness: Number,
//   popularity: Number
// })

const TrackName = mongoose.model('Trackname', dataSchema)
const seedDatabase = async () => {
  const data = topMusicData
  Song.collection.insertMany(data, function(err, r) {
  })
}
// seedDatabase()
//might be resetDatabase instead of seedDatabase below, will check
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await TrackName.deleteMany();
    topMusicData.forEach((trackName) => {
      const newTrackName = new TrackName(trackName)
      newTrackName.save();
    })
    //const data = topMusicData
    //Song.collection.insertMany(data, function(err, r) {
    }
  seedDatabase();
}

//I tried to make a more reusable function for handling errors but can't make it to work so the code is quite repetitive...
//switch to cover error-types and generate response
//commented out below for now as I've made error-handlers for each endpoint instead - which I got to work
// const handleErrors = (err, res) => {
//   switch (err) {
//     case err instanceof mongoose.Error.DocumentNotFoundError:
//       res.status(404).json({ message: "Document not found" })
//       break;
//     case err instanceof mongoose.Error.CastError:
//       res.status(400).json({ message: "Value cast error" })
//       break;
//     default:
//       console.log(err.messages)
//       // res.status(500)
//       break;
//   }
// }

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

// for all songs
app.get('/songs/all', async (req, res) => {
  try {
  const songs = await TrackName.find();
  if (songs) {
  res.status(200).json({
    success: true,
    body: songs
})
  } else {
    res.status(404).json({
      success: false,
      body: { message: "Songs not found" },
    })
  }
}
catch(err) {res.status(500).json({
  success: false,
  body: { message: "Error: " + err }
});}
})

//songs divided into 20 per page
app.get("/songs/", async (req, res) => {
  const page = req.query.page || 0;
  const perPage = req.query.perPage || 20;
  try {
    const songs = await TrackName.find().limit(perPage).skip(page * perPage);
    if (songs) {
      res.status(200).json({
        success: true,
        body: songs
    })
      } else {
        res.status(404).json({
          success: false,
          body: { message: "Songs not found" },
        })
      }
    }
    catch(err) {res.status(500).json({
      success: false,
      body: { message: "Error: " + err }
    });}
    })

// for individual songs and their id
app.get('/songs/:id', async (req, res) => {
  try {
    const singleTrackName = await TrackName.findById(req.params.id)
    if (singleTrackName) {
      res.status(200).json({
success: true,
body: singleTrackName
    })
  } else {
    res.status(404).json({
      success: false,
      body: { message: "No such song" }
    })
  }
}
catch(err) {
  res.status(500).json({
    success: false,
    body: { message: "Error: " + err }
  })
}
})

//this random doesn't seem to work 100%
app.get("/songs/random", async (req, res) => {
  const randomTrackName = await TrackName.aggregate([{$sample:{size: 1}}])
  try {
    if (randomTrackName) {
      res.status(200).json({
        success: true,
        body: randomTrackName});
      } else {
        res.status(404).json({
          success: false,
          body: { message: "Random song not found"}
        })
      }
    }
    catch(err) {
      res.status(500).json({
        success: false,
        body: { message: "Error: " + err}
      });
    }
  })

// app.get('/songs/:id', async (req, res) => {
//   const song = await Song.find({id:req.params.id}).exec()
//   .then(function (err, response) { if (err) handleErrors(err, res)})
//   res.json(song)
// })

// to add song
app.post('/songs', async (req, res) => {
  const newSong = req.body
  await Song.create(newSong, function(err, newSong){
    if (err) handleErrors(err, res)
  })
  res.status(201).end()
})

// to delete song
app.delete('/songs/:id', async (req, res) => {
  await Song.deleteOne({id:req.params.id}, function(err, newSong){
    if (err) handleErrors(err, res)
  })
  res.status(200).end()
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

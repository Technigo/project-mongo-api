import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";
const listEndpoints = require('express-list-endpoints')

//Should I use docker for below issue or what do I need to do to solve it?
//I couldn't make the MONGO_URL work with the localhost-version - when I did that it stopped working locally
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://ylva87:hHwxpsqpR3V62DS9@cluster0.hsexulf.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Song = mongoose.model('Song', {
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

const seedDatabase = async () => {
  const data = topMusicData
  Song.collection.insertMany(data, function(err, r) {
  })
}
// seedDatabase()

//switch to cover error-types and generate response
const handleErrors = (err, res) => {
  switch (err) {
    case err instanceof mongoose.Error.DocumentNotFoundError:
      res.status(404).json({ message: "Document not found" })
      break;
    case err instanceof mongoose.Error.CastError:
      res.status(400).json({ message: "Value cast error" })
      break;
    default:
      console.log(err.messages)
      // res.status(500)
      break;
  }
}

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
  res.json(listEndpoints(app));
});

// for all songs
app.get('/songs', async (req, res) => {
  const songs = await Song.find()
  res.json(songs)
})
// app.get('/songs', async (req, res) => {
//   const songs = await Song.find().exec((err, response) =>  {
//     console.log(err)
//     if (err !== "null") handleErrors(err, res)} )
//   res.json(songs)
// })

// for individual songs and their id
app.get('/songs/:id', async (req, res) => {
  const song = await Song.find({id:req.params.id})
  res.json(song)
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

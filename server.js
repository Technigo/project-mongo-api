// //////////////// IMPORT //////// //

// "express" is a popular web framework for building web applications in Node.js. It provides a set of features for creating web servers, routing requests, handling HTTP requests and responses, and more.
// "cors" is a middleware package that allows cross-origin resource sharing, which means it enables a server to allow requests from another domain.
// "mongoose" is an Object Data Modeling (ODM) library that provides a higher-level abstraction over MongoDB. It allows developers to define schemas for their data and provides a more intuitive API for interacting with MongoDB.

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ////////////////////////////////// //

// This code block sets up the connection between the Node.js application and the MongoDB database, 
// allowing the application to read and write data to the database using Mongoose.
// import topMusicData from "./data/top-music.json";

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
  res.send({
    Hello: "Welcome to this top-music API!",
    Endpoints: [
      { "/": "Startpage / Api Info" },
      { "/singlesongs/id/:id": "Single song. Just change the :id to a number between 1-50" },
      { "/allsongs10by10?page=1&pageSize=10": "All songs (10 per page). Change the url to show a specific page number or change the number of songs displayd ber page." },
    ]
  })
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

app.get("/singlesongs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findOne({ id: req.params.id });
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

app.get("/allsongs10by10", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const allsongsdevided = await Song.find().skip((page - 1) * pageSize).limit(pageSize);
    res.status(200).json({
      success: true,
      body: allsongsdevided
    });
  } catch (e) {
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

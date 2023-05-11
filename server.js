// Import required modules/packages
import express from "express"; // Web framework for Node.js
import cors from "cors"; // Middleware for enabling cross-origin resource sharing
import mongoose from "mongoose"; // Object Data Modeling (ODM) library for MongoDB

// Set up the connection to MongoDB using Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Set the default Promise implementation for Mongoose
mongoose.Promise = Promise;

// Set the port for the application to run on
const port = process.env.PORT || 8080;

// Create an instance of the Express application
const app = express();

// Add middleware to enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());


// Define the schema for the song data
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
});

// Create a model for the Song collection in MongoDB
const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
  await Song.deleteMany();
}
resetDatabase();
}

// Define the root route that provides API information
app.get("/", (req, res) => {
  res.send({
    Hello: "Welcome to this Music API!",
    Endpoints: [
      { "/": "Startpage / Api Info" },
      { "/singlesongs/id/:id": "Single song. Just change the :id to a number between 1-50" },
      { "/allsongs10by10?page=1&pageSize=10": "All songs (10 per page). Change the url to show a specific page number or change the number of songs displayed per page." },
      { "/songsdanceabilityover80": "Displays all songs with a danceability over 80. Gets the party started!" },

    ]
  });
});

// Define a route to get a single song by its ID
app.get("/singlesongs/id/:id", async (req, res) => {
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
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

// Define a route to get all songs in a paginated manner
app.get("/allsongs10by10", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const allSongsDivided = await Song.find().skip((page - 1) * pageSize).limit(pageSize);
    res.status(200).json({
      success: true,
      body: allSongsDivided
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

app.get("/songsdanceabilityover80", async (req, res) => {
  const {genre, danceability } = req.query;
  const response = {
    success: true,
    body:{}
  }
  // Regex only for strings
  const genreRegex = new RegExp(genre);
  const danceabilityQuery =  { $gt: 80 }

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
    res.status(500).json(response)
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

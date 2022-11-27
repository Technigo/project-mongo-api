import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//import dotenv from "dotenv"
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

//to do: envfile for sensitive data (enviromental variables, external file)


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//property keys saved as the model, User, Song
//mongoose user model - the structure
// const User = mongoose.model("User", {
// name: String,
// age: Number,
// deceased: Boolean
// }); 

//mongose song model - the structure
//object property keys name, age and number
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
});

// choose when we want to delete. when if(true) and will always happen
// put and delete entries in database
  if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase(); //DO NOT EVER DO THIS IN PRODUCTION ENVIROMENT!
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Start route show endpoints
app.get("/", (req, res) => {
  res.status(200).json ({
    data:({ "Available Routes for Top-Music" : listEndpoints(app) })
  }) 
});

app.get("/allsongs", async (req, res) => {
  const allSongs = await Song.find()
    res.status(200).json({
      success: true,
      body: allSongs
    })
});
 
// :id = path param
app.get("/songs/id/:id", async (req, res) => {
try {
  const singleSong = await Song.findById(req.params.id);
    if(singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
  } else {
    res.status(404).json({
      success: false,
      body: {
        message: "could not find that song"
      }
    });
  }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "invalid song id"
      }
    });
  }})

  // regular expression when to match strings
  // problem: every path parm declared must also be present in the url req - the whole path. instead create optional query params.
  // songs by chosen genre or danceability, or both
  app.get("/songs/", async (req, res) => {
    const {genre, danceability} = req.query; 
    const response = {
      success: true,
      body: {}
    }
    const matchAllRegex = new RegExp(".*");
    const matchAllNumreric = new RegExp("[0-9]");
    const genreQuery = genre ? genre : {$regex: matchAllRegex, $options: 'i'}; // /.*/gm;
    const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100}; // /.*/gm;  global multilines
    try {
      response.body = await Song.find({genre: genreQuery, danceability:danceabilityQuery})
      .limit(10).sort({energy: 1}).select({trackName: 1, artistName: 1, genre: 1})

    res.status(200).json({
       success: true,
       body: response
    });
  }  catch(error) {
      res.status(400).json({
      success: false,
      body: {
        message: error
        }
       });
      }
    }); 
   
//get songs that are max 3 min
// DOESN'T WORK
   app.get("/length", async (req, res) => {
    try {
      const lenghtSong = await Song.find({ length : { $lt : 180 }});
    if (mostPopular) {
      res.status(200).json({
        success: true,
        data: lenghtSong
      })
    } else {
      res.status(404).json({
        error: "no found"
      })
    }
    } catch (error) {
      res.status(400).json ({
        success: false,
        message: "invalid"
      });
    }
  });

// the 3 most popular songs show in order - most popular at first
  app.get('/songs/popular', async (req, res) => {
      const mostPopular = topMusicData.sort((start, end) => 
      end.popularity - start.popularity)

      const popularList = mostPopular.slice(0, 3)
      res.status(200).json ({
        data: popularList }) 
      })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
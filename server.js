import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import listEndpoints from "express-list-endpoints";
import topMusicData from "./data/top-music.json";

//to do:install & import dotenv for sensitive data (enviromental variables, external file)


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//property keys saved as the model, User, Song
//mongoose user model - the structure
const User = mongoose.model("User", {
name: String,
age: Number,
deceased: Boolean
}); 

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
    //const testUser = new User({name: "Johanna", age: 32, deceased: false}) 
   //testUser.save();
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
   
    // the 3 most popular songs 
  app.get('/songs/popular', async (req, res) => {
   //const popularity  = req.params;
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




//https://regex101.com  --> patterns for regular expressions (include vs regular expressions)
// /.*/gm regex to match every character in a string, min 36 min 
//creating a object--> : instead of = new user accept an argument, argument will be a object
 
{/*

Notes: 
//convention user upercase
//property "type" (angular, typescript)
// 2 endpoint songs --> this needed to desplay songs in browser and postman
// call object {}
// app.get("/songs", async (req, res) => {
//   const allTheSongs = await Song.find({});
//   res.status(200).json({
//     success: true,
//     body: allTheSongs
//   });
// });

// what we see in postman is what we get from the backend (backend build what to see, filter out)
// what we see in compass: the entire database, all the data
// get parameter genre, get all the matching songs
 //app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) => {

 //  if (req.params.genre && req.params.danceability) {
      //sort by object {}


 if (req.params.genre) {
        const allMatchingSongs = await Song.find({
        genre: req.params.genre, danceability: req.params.danceability });
        res.status(200).json({
          success: true,
            body: allMatchingSongs
          });

    } else if (req.params.genre && !req.params.danceability) {
      const allMatchingSongs = await Song.find({
        genre: req.params.genre, danceability: req.params.danceability });
        res.status(200).json({
          success: true,
            body: allMatchingSongs
        });

    } else if (!req.params.genre && req.params.danceability) {
        const allMatchingSongs = await Song.find({
        genre: req.params.genre, danceability: req.params.danceability });
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
    }})
  */}
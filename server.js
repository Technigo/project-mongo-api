import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Swagger for API documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndpoints = require('express-list-endpoints');

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

//Seed database
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Song.deleteMany({})

		topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
			newSong.save()
		})
  }
  seedDatabase()
}

// Defining routes here
app.get("/", (req, res) => {
  const welcomeText = "Top Spotify Songs API";
  const apiDocumentation = "https://project-express-api-lldotyfewa-lz.a.run.app/api-docs";
  const endpoints = (listEndpoints(app))
  
  res.send({
    body: {
      welcomeText,
      apiDocumentation,
      endpoints
    }
  });
});

//Get all songs in the dataset with paging, params are page and limit
app.get("/songs", async (req, res) => {
  try {
    // Parse query parameters to integers or default to 1 page/10 entries limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value - how many entries to skip from the beginning of the dataset
    const skip = (page - 1) * limit;

    // Query database with skip and limit
    const songList = await Song.find(req.params).skip(skip).limit(limit);

    if (songList.length > 0) {
      res.status(200).json({
        success: true,
        body: {
          songList: songList,
          currentPage: page,
          totalPages: Math.ceil(await Song.countDocuments() / limit), // Eg: 50 / 10 = 5 pages
          totalSongRecords: await Song.countDocuments() // Counts total number of records or items in the DB
        }
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "No songs found in the list"
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

// Get happy songs - songs between bpm 100 and 160 and group them by genre
app.get("/songs/happy", async (req, res) => {
  const response = {
    success: true,
    body:{}
  }
  
  // array of stages applied in sequence to the collection
  const pipeline = [
    {
      $match: { bpm: { $gte: 100, $lte: 160 } }
    },
    {
      $group: { 
        _id: "$genre",
        happySongs: { $push: { trackName: "$trackName", artistName: "$artistName", bpm: "$bpm" }}
      }
    },
    {
      $project: {
        _id: 0, // _id is excluded from the output by setting it to 0
        genre: "$_id", //rename the _id field from the previous stage to genre
        happySongs: 1
      }
    }
  ];

  try {
    const searchResultFromDB = await Song.aggregate(pipeline)
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json(response)
    }
  } catch(e) {
    response.success = false,
    res.status(500).json(response)
  }
});

// Get song by id
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
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Get songs by name
app.get("/songs/:name", async (req, res) => {
  try {
    // regex to remove spaces and to make the param case insensitive
    let regExpression = "";
    let trackNameNoSpace = req.params.name.replace(" ", "")
    for(const char of trackNameNoSpace) {
      regExpression += `(((\\s)*)(${char})((\\s)*))`;
    }

    const tracks = await Song.find({ trackName: { '$regex' : new RegExp(`(.*)(${regExpression})(.*)`), '$options' : 'ix'} });

    if (tracks.length > 0) {
      res.status(200).json({
        success: true,
        body: tracks
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `No songs with ${req.params.name}, try again!`
        }
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e.message
      }
    });
  }
});


//Get all artists in the dataset
app.get("/artists", async (req, res) => {
  try {
    const artistList = await Song.find({},{ artistName: 1, _id: 0 });
    if (artistList) {
      res.status(200).json({
        success: true,
        body: artistList
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Data for artists not found"
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

// Get songs by a specific artist
app.get("/artists/:name", async (req, res) => {
  try {
    // regex to remove spaces and to make the param case insensitive
    let regExpression = "";
    let artistNameNoSpace = req.params.name.replace(" ", "")
    for(const char of artistNameNoSpace) {
      regExpression += `(((\\s)*)(${char})((\\s)*))`;
    }
    console.log(regExpression)

    const artistDiscography = await Song.find({ artistName: { '$regex' : new RegExp(`(.*)(${regExpression})(.*)`), '$options' : 'ix'} });
    console.log(artistDiscography);

    if (artistDiscography.length > 0) {
      res.status(200).json({
        success: true,
        body: artistDiscography
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `No songs by ${req.params.name}`
        }
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e.message
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

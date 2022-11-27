import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import theOffice from "./data/the-Office.json"
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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


const Office = mongoose.model("Office", {
  parent_id: Number,
  parent: String,
  reply: String,
  character: String
});

// RESET_DB=true npm run dev

/* if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase();
} */

if(process.env.RESET_OFFICE) {
  const resetDataBase = async () => {
    await Office.deleteMany();
    theOffice.forEach(singleQuote => {
      const newQuote = new Office(singleQuote);
      newQuote.save();
    })
  }
  resetDataBase();
}
 

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send([
    {"/": "Start page"},
    {"/songs/all": "Displays all songs"},
    {"/songs/id/:id": "Displays one song with specific ID. example songs/id/637cebbb8d84e049f7380e06"},
    {"/songs?danceability": "To find max 2 songs with a danceability. example: http://localhost:8080/songs?danceability=76"},
    {"/songs?genre": "To find max 2 songs with a danceability. example: http://localhost:8080/songs?genre=country rap"},
    {"/office/all": "display all office quotes"},
  ]);
});

 app.get("/songs/:all", async (req, res) => {
    try {
      const allTheSongs = await Song.find({});
      if (allTheSongs) {
      res.status(200).json({
        success: true,
        body: allTheSongs
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find songs"
        }
    })
  }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "invalid input"
      }
    })
  }
  }) 

  app.get("/office", async (req, res) => {
    try {
      const allQuotes = await Office.find({});
      if (allQuotes) {
      res.status(200).json({
        success: true,
        body: allQuotes
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find quotes"
        }
    })
  }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "invalid input"
      }
    })
  }
  }) 

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
        message: "Could not find song"
      }
  })
}
} catch (error) {
  res.status(400).json({
    success: false,
    body: {
      message: "Invalid id"
    }
  })
}
})

  app.get("/songs/", async (req, res) => {
  
    const {genre, danceability} = req.query;
    const response = {
      success: true,
      body: {}
    }
    const matchAllRegex = new RegExp(".*");
    const genreQuery = genre ? genre : {$regex: matchAllRegex,  $options: 'i' };
    const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100};
  
    try {
      response.body = await Song.find({genre: genreQuery, danceability:danceabilityQuery}).limit(2).sort({energy: 1}).select({trackName: 1, artistName: 1})

      res.status(200).json({
        success: true,
        body: response
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        body: {
          message: error
        }
      });
    }
  
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



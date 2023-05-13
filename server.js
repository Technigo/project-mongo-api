import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


const { Schema } = mongoose;

const songSchema = new Schema ({
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
  popularity: Number,
});

const Song = mongoose.model("Song", songSchema);

if(process.env.RESET_DB){
  console.log('resetting database')
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong) 
      newSong.save()
    }) 
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Song Page!");
  res.json(listEndPoints(app))
});

app.get("/songs", async (req, res) => {
const { genre, danceability } = req.query
  const response = {
  sucess:true,
  body:{}
}

const genreRegex = new RegExp(genre);
const danceabilityQuery = { $gt: danceability ? danceability :0 };

  try{
    const searchResultFromDB = await Song.find({
      genre: genreRegex, danceability: danceabilityQuery });
    if (searchResultFromDB) {
      response.body = searchResultFromDB,
      res.status(200).json(response)
    } else {
      response.sucess = false,
      res.status(404).json(response)
    }
  } catch (e){
    response.sucess= false,
    res.status(500).json(response)
    }
    });

    app.get("/songs/id/:id", async (req, res) =>{
      try {
        const singleSong = await Song.findOne({id: requestAnimationFrame.params.id});
        if (singleSong) {
          res.status(200).json({
            sucess: false,
            body: {
              message: "Song not found"
            }
          })
        }
      } catch(e) {
        res.status(500).json({
          sucess: false,
          body: {
            message: "error"
          }
        })
      }
    });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

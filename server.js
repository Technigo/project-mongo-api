import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"; 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // connection. Using the method connect, passing on the url and then the parameter object
mongoose.Promise = Promise;

const User = mongoose.model("User", {
  name: String,
  age: Number,
  deceased: Boolean
});

//model how your data set will look like
const Song = mongoose.model("Song", {
  "id": Number,
  "trackName": String,
  "artistName": String,
  "genre": String,
  "bpm": Number,
  "energy": Number,
  "danceability": Number,
  "loudness": Number,
  "liveness": Number,
  "valence": Number,
  "length": Number,
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
});


//map out all data from our json into our db
if (process.env.RESET_DB) {
    const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
    const newSong = new Song (singleSong);
    newSong.save();
   })
    // await User.deleteMany();
    // const testUser = new User ({name: "Lisa", age: 53, deceased: false });
    // testUser.save();
  }
  resetDataBase();
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
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/animals";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Animal = mongoose.model('Animal', {
name: String,
age: Number,
isFurry: Boolean
})

Animal.deleteMany().then(() => {

new Animal ({ name: "Alfons", age: 2, isFurry: true}).save()
new Animal ({ name: "Lucy", age: 5, isFurry: true}).save()
new Animal ({ name: "Goldy the Goldfish", age: 1, isFurry: false}).save()
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start


const User = mongoose.model("User", {
  name: String,
  age: Number,
  deceased: Boolean
})

const Song = mongoose.model ("Song", {
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

//if(process.env.RESET_DB) --> cleaning out the database. Can be used instead of true, and then run it in the terminal
if(true) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
    const newSong = new Song(singleSong)
    newSong.save()
    })
    // const testUser = new User({name: "Daniel", age: 28, deceased: false})
    // testUser.save()
  }
resetDataBase()
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next)=> {
if (mongoose.connection.readyState===1) {
  next()
} else {
  res.status(503).json({error: "Service unavailable"})
}
})

// Start defining your routes here
app.get("/", (req, res) => {
  Animal.find().then(animals =>{
  res.json(animals)
  });
});

app.get("/:name", async (req, res)=> {
  try {
Animal.findOne({name: req.params.name}).then(animals => {
if(animals) {
  res.json(animals)
    } else {
      res.status(404).json({error: "Not found"})
    }

  }) } catch (err) {
    res.status(404).json({error: "Invalid user ID"})
  }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

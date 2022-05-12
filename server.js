import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

import players from './data/football-players.json'

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

const Player = mongoose.model("Player", {
  id: Number,
  name: String,
  position: String,
  club: String,
  games: Number,
  goals: Number,
})


if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDatabase = async () => {
    await Player.deleteMany()
    players.forEach(player => {
      const newPlayer = new Player(player)
      newPlayer.save()
    })
  }
  seedDatabase()
  
}



// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Project Mongo API!");
});

app.get("/players", (req, res) => {
  Player.find().then(players => {
    res.json(players)
  })
})

app.get('/:name', (req, res) => {
  Player.findOne({name: req.params.name}).then(player => {
    if(player) {
      res.json(player)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

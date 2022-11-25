import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nesGamesData from "./data/NES-games.json";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavaliable" })
  }
});

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// MongoDB 
const Game = mongoose.model("Game", {
  title: String,
  developer: String,
  publisher: String,
  release_date: String
});

if (true) {
  const resetDatabase = async () => {
    await Game.deleteMany();
    nesGamesData.forEach(singleGame => {
      const newGame = new Game(singleGame);
      newGame.save();
    })
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({responseMessage: "NES-games library at /games"});
});

app.get("/games/", async (req, res) => {
  const {title, developer, publisher} = req.query;

  const titleQuery = title ? title : /.*/gm;
  const developerQuery = developer ? developer : /.*/gm;
  const publisherQuery = publisher ? publisher : /.*/gm;

  try {
    const response = await Game.find({title: titleQuery, developer: developerQuery, publisher: publisherQuery});
    res.status(200).json({
      success: true,
      nesGames: response
    })
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: "Invalid id-request"
    })
  }
});

app.get("/games/:id", async (req, res) => {
  try {
    const singleGame = await Game.findById(req.params.id)
    if (singleGame) {
      res.status(200).json({
        success: true,
        body: singleGame
      })
    } else {
      res.status(404).json({
        success: false,
        error: "Not Found"
      })
    } 
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: "Invalid id-request"
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

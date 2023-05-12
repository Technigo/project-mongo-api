import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/nintendo-games";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const allEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  // res.send("Nintendo Games!");
  res.json(allEndpoints(app));
});

const { Schema } = mongoose;

const gameSchema = new Schema ({
  title: String,
  platform: String,
  unix_timestamp: Number,
  esrb_rating: String,
  developers: Array,
  genres: Array,
})

const Game = mongoose.model("Game", gameSchema)

app.get("/games", async (req, res) => {
  try {
  const { platform, rating } = req.query
  let games = await Game.find();

  if (platform) {
    games=games.filter((game) => {
      return game.platform.toLowerCase() === platform.toLowerCase()
    })
  }

  if (rating) {
    games=games.filter((game) => {
      return game.esrb_rating.toLowerCase() === rating.toLowerCase()
    })
  }

  if (games) {
    res.status(200).json({
      success: true,
      body: games
    })
  } else {
    res.status(404).json({
      success: false,
      body: {
        message: "Games not found"
      }
    })
  }
} catch (error) {
  res.status(500).json({
    success:false,
    body: {
      message: error
    }
  })
}
})

app.get('/games/id/:id', async (req, res) => {
  try {
    const singleGame = await Game.findById(req.params.id);
    if (singleGame) {
      res.status(200).json({
        success: true,
        body: singleGame
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Game not found"
        }
      })
    }
    } catch (error) {
      res.status(500).json({
        success: false,
        body: {
          message: e
        }
      })
    }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

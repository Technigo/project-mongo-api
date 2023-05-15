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
  year_released: Number,
  esrb_rating: String,
  developers: Array,
  genres: Array,
})

const Game = mongoose.model("Game", gameSchema)

app.get("/games", async (req, res) => {
    const { platform, rating, releaseyear } = req.query
    const response = {
      success: true,
      body: {}
    }
    const platformRegex = new RegExp(platform, "i");
    const ratingRegex = new RegExp(rating, "i");
    //these are case sensitive
    const releaseyearQuery = releaseyear ? {$eq: releaseyear} : {$gt: 0};

    try {
      const searchResults = await Game.find({platform: platformRegex, esrb_rating: ratingRegex, year_released: releaseyearQuery});
      
      if (searchResults) {
        response.body = searchResults;
        res.status(200).json(response);
      } else {
        response.success = false,
        response.body = {message: "Games not found"};
        res.status(404).json(response);
      }
  } catch (error) {
      response.success = false,
      response.body = {message: error};
      res.status(500).json(response);
  }
})

app.get('/games/id/:id', async (req, res) => {
    const response = {
      success: true,
      body: {}
    }
    try {
      const singleGame = await Game.findById(req.params.id);
      if (singleGame) {
        response.body = singleGame;
        res.status(200).json(response);
      } else {
        response.success = false,
        response.body = {message: "Games not found"};
        res.status(404).json(response);
      }
    } catch (error) {
      response.success = false,
      response.body = {message: error};
      res.status(500).json(response);
    }
})

// const Test = mongoose.model("Test", gameSchema)

// app.get('/test', async (req, res) => {
//   try {
//    let tests = await Test.find();

//   if (tests) {
//     res.status(200).json({
//       success: true,
//       body: tests
//     })
//   } else {
//     res.status(404).json({
//       success: false,
//       body: {
//         message: "Tests not found"
//       }
//     })
//   }
// } catch (error) {
//   res.status(500).json({
//     success:false,
//     body: {
//       message: error
//     }
//   })
// }
// })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

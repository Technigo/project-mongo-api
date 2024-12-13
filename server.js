import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nintendoGames from "./data/nintendoswitch-games.json";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

// To use .env, also checked if my .env file was in .gitignore
dotenv.config();

// Added this to my .env file: MONGO_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority"
// To make it more secure
const mongoUrl = process.env.MONGO_URL;
// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"; // If connected to compass and Local host
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 3000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Defines mongoose model
const Game = mongoose.model('Game', {
  id: Number,
  name: String,
  category: String,
  release_year: Number,
  rating: Number
});

// Seed database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Game.deleteMany({});
    nintendoGames.forEach(async (gameData) => {
      const game = new Game(gameData);
      await game.save();
    });
    console.log("Database seeded!");
  };

  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  const documentation = {
    Welcome: "Welcome to the Nintendo Switch Games API!",
    Endpoints: listEndpoints(app).map((endpoint) => {
      return {
        path: endpoint.path,
        methods: endpoint.methods,
        middlewares: endpoint.middlewares,
      }
    }),
    QueryParameters: {
      id: "Filter games by id (case-insensitive).",
      sortedGames: "Sort games by rating (true/false)."
    }
  }
  res.json(documentation)
});

// Get all videogames http://localhost:3000/videogames
app.get("/videogames", async (req, res) => {
  const { sorted, category, release_year } = req.query;

  // Sorted rating from highest to lowest http://localhost:3000/videogames?sorted=true
  if (sorted) {
    const sortedGames = await Game.find().sort({ rating: -1 }); // Sort after rating, highest first
    return res.json(sortedGames);
  }

  // Dynamic query-object so that you can filter on both category and release_year
  // For example http://localhost:3000/videogames?category=racing&release_year=2017
  const query = {};

  // For example http://localhost:3000/videogames?category=racing
  if (category) {
    query.category = { $regex: category, $options: "i" }; // Case-insensitive search on category. for example its ok if database says "Racing" and url says "racing"
  }

  // For example http://localhost:3000/videogames?release_year=2017
  if (release_year) {
    query.release_year = +release_year; // Filtrera på release_year
  }

  // Get games depending on the dynamic query-object
  const videogames = await Game.find(query);

  // Send result as JSON
  res.json(videogames);

});

// Endpoint that returns one single videogame
// For example with id=3 http://localhost:3000/videogames/3
app.get("/videogames/:id", async (req, res) => {
  const id = req.params.id;
  const videogame = await Game.findOne({ id: +id });

  if (videogame) {
    res.json(videogame);
  } else {
    res.status(404).json({ error: "No videogame found with that ID" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

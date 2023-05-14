import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import pokemonData from "./data/pokemons.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const pokemonSchema = new Schema ({
    id: Number,
    name: String,
    type1: String,
    type2: String,
    total: Number,
    hp: Number,
    attack: Number,
    defense: Number,
    spAttack: Number,
    spDefence: Number,
    speed: Number,
    generation: Number,
    legendary: Boolean
})

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

// resets database with a delete and replace, uses the mongoose model of "delete many"
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Pokemon.deleteMany();
    pokemonData.forEach((singlePokemon) => {
      const newPokemon = new Pokemon(singlePokemon);
      newPokemon.save()
    })
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

app.get("/pokemons", async (req, res) => {
  // creates four differerent queries
  const { type1, type2, hp, name } = req.query
  const response = {
    success: true,
    body: {}
  }
  // makes sure you find all instances of f ex 'pop', not just that exact phrase (only works on strings!) 'i' removes case sensitive
  const type1Regex = new RegExp(type1, 'i')
  const type2Regex = new RegExp(type2, 'i')
  const nameRegex = new RegExp(name, 'i')
  // a way to show number values, with a "greater than" query operator
  const hpQuery = { $gt: hp ? hp: 0 };
 
  try {
    // uses the mongoose model "find"
    const searchResultFromDB = await Pokemon.find({type1: type1Regex, type2: type2Regex, hp: hpQuery, name: nameRegex})
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json(response)
    }
  } catch(e) {
    res.status(500).json(response)
  }
});

app.get("/pokemons/id/:id", async (req, res) => {
  try {
    // uses the mongoose model "find by id"
    const singlePokemon = await Pokemon.findById(req.params.id);
    if (singlePokemon) {
      res.status(200).json({
        success: true,
        body: singlePokemon
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Pokemon not found"
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

app.get("/pokemons/legendary", async (req, res) => {
  const isLegendary = req.query.legendary === 'true';
  try {
    const query = isLegendary ? { legendary: true } : { legendary: { $in: [true, false] } };
    const pokemons = await Pokemon.find(query);
        res.status(200).json({
        success: true,
        data: pokemons
    })
  } catch(e) {
    res.status(500).json({
      success: false,
      message: e
      })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

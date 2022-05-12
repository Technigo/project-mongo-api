import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import listEndpoints from "express-list-endpoints";

import data from './data/hammarby.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Player = mongoose.model('Player', {
  name: String,
  year_born: Number,
  age: Number,
  position: String,
  nationality: String,
  shirt_number: Number,
  done_goal: String
})

if (process.env.RESET_DB === 'true') {
  const seedDatabase = async () => {
    await Player.deleteMany({})

    data.forEach((item) => {
      const newPlayer = new Player(item)
      newPlayer.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// ERROR HANDLING:
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1 ) { // 1 då restrande inte är connected. 1 = connected
    next() // Hanterar funktionen nedan, alltså när allt fungerar som vanligt
  } else {
    res.status(503).json({error: 'Service unavilable'})
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    {"Welcome":"This is an open API with Hammarbys football players 2022.",
    "Database": "MongoDB",
    "Endpoints": "/endpoints",
    "Routes":[{
    "/hammarby":"Get all the players",
    "/hammarby/names/:name":"Get a player by name",
    "/hammarby/ages/:age":"Get the player with a specific age",
    "/hammarby/positions/:position":"Get player based on their position (eg: striker, midfielder, defender, goalkeeper)",
    "/hammarby/born/:year":"Get player based on the year they were born (eg: 1991)",
    "/hammarby/nationalitys/:nationality":"Get player based on their nationality (eg: Sweden, Denmark, Albania, Gambia)",
    "/hammarby/goals/:goal":"Shows the players who has done at least one goal for Hammarby (yes / no)",
    "/hammarby/numbers/:number":"Shows the player with a specific shirt number (eg: 15)"
  }],
  "Querys":[{
    "/hammarby/players?shirt_number=number":"Shows the player with a specific shirt number (eg: 15)",
    "/hammarby/players?name=name":"Shows the named player (eg: Gustav Ludwigson)",
    "/hammarby/players?position=position":"Shows player based on their position (eg: striker, midfielder, defender, goalkeeper)",
    "/hammarby/players?age=age":"Get the player with a specific age (eg: 18)",
    "/hammarby/players?year_born=year":"Shows players that was bort on a specific year (eg: 1991)",
    "/hammarby/players?nationality=nationality":"Shows players based on their nationality (eg: Sweden, Denmark, Albania, Gambia)",
    "/hammarby/players?done_goal=goal":"Shows the players who has done at least one goal for Hammarby (yes / no",

    "You can play around with these endpoitns and querys":"Eg: /hammarby?born=1991&goal=yes",
    }]
}
  )
});

app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
})

// Get all players
app.get('/hammarby', async (req, res) => {
  const players = await Player.find()
  res.json(players)
})

// Find players by position
app.get('/hammarby/positions/:position', async (req, res) => {
  try {
    const playerPosition = await Player.find({ position: req.params.position})
    if (playerPosition.length === 0) {
      res.status(404).json({error: 'position not found'})
    } else {
      res.json(playerPosition)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid position'})
  }
})

// Find players by age
app.get('/hammarby/ages/:age', async (req, res) => {
  try {
    const playerAge = await Player.find({ age: req.params.age})
    if (playerAge.length === 0) {
      res.status(404).json({error: 'Age not found'})
    } else {
      res.json(playerAge)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid age'})
  }
})

// Find players by name
app.get('/hammarby/names/:name', async (req, res) => {
  try {
    const playerName = await Player.find({ name: req.params.name})
    if (playerName.length === 0) {
      res.status(404).json({error: 'Name not found'})
    } else {
      res.json(playerName)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid name'})
  }
})

// Find players by Nationality
app.get('/hammarby/nationalitys/:nationality', async (req, res) => {
  try {
    const playerNationality = await Player.find({ nationality: req.params.nationality})
    if (playerNationality.length === 0) {
      res.status(404).json({error: 'Nationality not found'})
    } else {
      res.json(playerNationality)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid nationality'})
  }
})

// Find players by Shirt number
app.get('/hammarby/numbers/:number', async (req, res) => {
  try {
    const playerNumber = await Player.find({ shirt_number: req.params.number})
    if (playerNumber.length === 0) {
      res.status(404).json({error: 'Number not found'})
    } else {
      res.json(playerNumber)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid number'})
  }
})

// Find players by who has done a goal for Hammarby or not
app.get('/hammarby/goals/:goal', async (req, res) => {
  try {
    const playerGoal= await Player.find({ done_goal: req.params.goal})
    if (playerGoal.length === 0) {
      res.status(404).json({error: 'goal not found'})
    } else {
      res.json(playerGoal)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid goal'})
  }
})

// Find players by the year they were born
app.get('/hammarby/born/:year', async (req, res) => {
  try {
    const playerBorn= await Player.find({ year_born: req.params.year})
    if (playerBorn.length === 0) {
      res.status(404).json({error: 'year not found'})
    } else {
      res.json(playerBorn)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid year'})
  }
})


// Here you can find diffrent querys with multible outcomes. Eg: /hammarby/players?position=goalkeeper
app.get("/hammarby/players", async (req, res) => {
  try {
    let allPlayers = await Player.find(req.query);
    if (req.query.x) {
      const players = await Player.find().lt(
        "x",
        req.query.x
      );
      allPlayers = players;
    }
    if (!allPlayers.length) {
      res.status(404).json(`Sorry, no query found.`)
    } else {
      res.json(allPlayers);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid'})
  }
 
});

// Here you can find diffrent querys with one outcome. Eg: /hammarby/players?shirt_number=15 or /hammarby/players?age=18&position=striker
app.get("/hammarby/players", async (req, res) => {
  try {
    let allPlayers = await Player.findOne(req.query);
    if (req.query.x) {
      const players = await Player.findOne().lt(
        "x",
        req.query.x
      );
      allPlayers = players;
    }
    if (!allPlayers.length) {
      res.status(404).json(`Sorry, no query found.`)
    } else {
      res.json(allPlayers);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid'})
  }
 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

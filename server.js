import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import worldCupData from "./data/world-cup.json";
import listEndpoints from "express-list-endpoints";

function connectoToDB() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity 
  };

  mongoose.connect(mongoUrl, options)
    .then(() => {
      if (process.env.RESET_DB) {
        const seedDatabase = async () => {
          await Cup.deleteMany({})

          worldCupData.forEach((data) => {
            new Cup(data).save()
              .then(() => console.log(`Entry created: ${JSON.stringify(data)}`))
          })
        }
        seedDatabase()
      }
    });
  mongoose.Promise = Promise;
};

connectoToDB();

const port = process.env.PORT || 8080;
const app = express();


app.use(cors());
app.use(express.json());

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app))
});

// Seed the database
const Cup = mongoose.model('Cup', {
  year: Number,
  host: String,
  winner: String,
  second: String,
  third: String,
  fourth: String,
  goals_scored: Number,
  teams: Number,
  games: Number,
  attendance: Number
});

// Start defining your routes here
app.get("/", (req, res) => {
  const WorldCupApi = {
    Welcome: 'Hi! This a World Cup Api (1930 - 2018)',
    Routes: [{
      "/cups": 'Get all world cup.',
      "/cups/id/'number'": 'Get World Champion with Matching Database ID.',
      "/cups/winner/argentina": 'Get the years that Argentina was World Champion.',
      "/cups/winner/'country'": 'Get the result of a World Champion',
      "/endpoints": "Get API endpoints."
    }]
  }
  res.send(WorldCupApi)
});

app.get("/cups", async (req, res) => {
  let cups = await Cup.find(req.query)

  if (req.query.year) {
    const yearCup = await Cup.find().gt('year', req.query.year)
    cups = yearCup
  } else {
    res.status(404).json({ error: 'Not found' });
  }
  res.json(cups)
});

app.get("/cups/id/:_id", async (req, res) => {
  try {
    const cupId = await Cup.findById(req.params._id)
    if (cupId) {
      res.json(cupId)
    } else {
      res.status(404).json({ error: "Id not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Id" })
  }
});

app.get("/cups/winner/argentina", async (req, res) => {
  Cup.find({ winner: 'Argentina' }, (error, data) => {
    if (error) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.send(data);
    }
  });
});

app.get("/cups/winner/:winner", async (req, res) => {
  const { winner } = req.params

  try {
    const winnerCup = await Cup.find({ winner: { $regex: new RegExp("^" + winner, "i") } })
    if (winnerCup) {
      res.json(winnerCup)
    } else {
      res.status(404).json({ error: 'Winner not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Error' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

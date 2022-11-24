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
}

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
      "/cups": 'Get all world cup.'
    }]
  }

  res.send(WorldCupApi)
});

app.get("/cups", async (req, res) => {
  let cups = await Cup.find(req.query)

  if(req.query.year) {
    const yearCup = await Cup.find().gt('year', req.query.year)
    cups = yearCup
  }

  if(req.query.winner) {
    const winnerCup = await Cup.find().gt('winner', req.query.winner)
    cups = winnerCup
  }

  res.json(cups)

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

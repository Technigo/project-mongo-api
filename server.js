import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import goldenGlobesData from "./data/golden-globes.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//To handle if database becomes unreachable
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: "Service unavailable"
    })
  }
})


const GoldenGlobes = mongoose.model("GoldenGlobes", {
  year_film: Number, 
  year_award: Number, 
  ceremony: Number, 
  category: String, 
  nominee: String,
  film: String, 
  win: Boolean
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await GoldenGlobes.deleteMany()
    goldenGlobesData.forEach(item => {
      const newItem = new GoldenGlobes(item)
      newItem.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  const endpoints = {
    Welcome: "Hi! This is an open API about Golden Globes",
    Routes: [
      {
        "/goldenglobes": "Get an array of all Golden Globes objects in the array",
        "/goldenglobes/awardyear/:year_award": "Gives back an array with objects based on the year that is typed",
        "/goldenglobes/films/:film": "Gives back an array with the film name that was typed",
        "/goldenglobes/nominees/:nominee": "Gives back an array with objects based on the name of the nominee",
        "/goldenglobes/winners/:win": "Gives back an array of all the winners or the ones who did not win",
        "/goldenglobes/release/:year_film": "Return one object that matches the realese year of the film"
      },
    ],
  }
  res.send(endpoints)
});

app.get("/goldenglobes", async (req, res) => {
  const allGoldenGlobes = await GoldenGlobes.find()
  res.json(allGoldenGlobes)
})


app.get("/goldenglobes/awardyear/:year_award", async (req,res) => {
  try {
    const yearAward = await GoldenGlobes.find({year_award: req.params.year_award})
    if (yearAward) {
      res.json(yearAward)
    } else {
      res.status(404).json({error: "No nominee found by that year"})
    }
  } catch (err) {
    res.status(404).json({error: "Invalid input"})
  }
})

app.get("/goldenglobes/films/:film", async (req, res) => {
  const { film } = req.params
  try {
    const films = await GoldenGlobes.find({film: film})
    if (films) {
      res.status(200).json(films)
    }
  } catch (err) {
    res.status(400).json({error: "Inavlid film name"})
  }
  })


app.get("/goldenglobes/nominees/:nominee", async (req,res) => {
  const nominee = await GoldenGlobes.find({nominee: req.params.nominee})
  res.send(nominee)
})

app.get("/goldenglobes/winners/:win", async (req, res) => {
  const winners = await GoldenGlobes.find({win: req.params.win})
  res.send(winners)
})

 
app.get("/goldenglobes/release/:year_film", async (req,res) => {
  try {
    const releaseYear = await GoldenGlobes.findOne({year_film: req.params.year_film})
    if (releaseYear) {
      res.json(releaseYear) 
    } else {
      res.status(404).json({error: "No film found"})
    }
  } catch (err) {
    res.status(400).json({error: "Invalid film title"})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

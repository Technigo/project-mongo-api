import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Template
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello, welcome to this GoldenGlobe API")
});

app.get("/goldenglobes", async (req, res) => {
  const allGoldenGlobes = await GoldenGlobes.find()
  res.json(allGoldenGlobes)
})

//Gives back an array with a specific year
app.get("/goldenglobes/years/:year_award", async (req,res) => {
  const yearAward = await GoldenGlobes.find({year_award: req.params.year_award})
  res.send(yearAward)
})

//Gives back one item of nominee
app.get("/goldenglobes/nominees/:nominee", async (req,res) => {
  const nominee = await GoldenGlobes.find({nominee: req.params.nominee})
  res.send(nominee)
})

app.get("/goldenglobes/winners/:win", async (req, res) => {
  
  const winners = await GoldenGlobes.find({win: req.params.win})
  res.send(winners)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import goldenGlobes from "./data/golden-globes.json";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const { Schema } = mongoose;
const globesSchema = new Schema({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean,
});

const Globes = mongoose.model("Globes", globesSchema);

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Globes.deleteMany();

    goldenGlobes.forEach((globesData) => {
      new Globes(globesData).save();
    });
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const info = endpoints.map((endpoint) => ({
    path: endpoint.path,
    methods: endpoint.methods.join(", "),
  }));
  res.json(info);
});


// SHOW ALL NOMINATIONS
app.get("/nominations", async (req, res) => {
  const allNominations = await Globes.find();
  if (allNominations.length > 0) {
    res.json(allNominations);
  } else {
    res.status(404).send("No nominations were found");
  }
});


// SHOW ALL NOMINATIONS FOR SPECIFIC YEAR
app.get("/nominations/:awardYear", async (req, res) => {
  const { awardYear } = req.params;
  const yearOfAward = await Globes.find({ year_award: awardYear }).exec();

  if (yearOfAward) {
    res.json(yearOfAward);
  } else {
    res.status(404).send("This year's nominations were not found");
  }
});


// SHOW ALL WINNERS
app.get("/nominations/wins", async (req, res) => {
  const allWins = await Globes.find({ win: true }).exec();

  if (allWins) {
    res.json(allWins);
  } else {
    res.status(404).send("This year's wins were not found");
  }
});

// SHOW ALL WINNERS OF A SPECIFIC YEAR
app.get("/nominations/wins/:yearWon", async (req, res) => {
  const { yearWon } = req.params;
  const wonYear = await Globes.find({
    win: true,
    year_award: yearWon,
  }).exec();

  if (wonYear) {
    res.json(wonYear);
  } else {
    res.status(404).send("This year's nominations were not found");
  }
});


// SHOW WINNER OF BEST DIRECTOR FOR SPECIFIC YEAR
app.get("/nominations/wins/:yearWon/best-director", async (req, res) => {
  const { yearWon } = req.params;
  const bestDirector = await Globes.find({
    win: true,
    year_award: yearWon,
    category: "Best Director - Motion Picture",
  }).exec();

  if (bestDirector) {
    res.json(bestDirector);
  } else {
    res.status(404).send("This year's nominations were not found");
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

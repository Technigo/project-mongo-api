import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import doItBeFartin from "./data/doitbefartin.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/doitbefartin";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Animal = mongoose.model("Animal", {
  name: String,
  scientificName: String,
  doesItFart: Boolean,
  doesItMaybeFart: Boolean,
  descriptionExists: Boolean,
  descriptionNotes: String,
  paperLink: String,
  verifiedBy: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Animal.deleteMany();
    doItBeFartin.forEach((animal) => {
      new Animal(animal).save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    { "/": "Home" },
    { "/animals": "All the data" },
    { "/animal/:animal": "Find one animal" },
    { "/description/:boolean": "True or false if there a fart description" },
    { "/doitbefartin/:boolean": "True or false if it be fartin" },
    {
      "/doitmaybebefartin/:boolean": "True or false if it MAYBE be fartin",
    },
  ]);
});

app.get("/animals", (req, res) => {
  res.status(200).json({
    data: doItBeFartin,
    success: true,
  });
});

app.get("/animal/:animal", (req, res) => {
  // const animalSearch = await Animal.find({name: req.params.animal})
  // res.send(animalSearch)
  res.status(200).json({
    data: doItBeFartin,
    success: true,
  });
});

app.get("/description/:boolean", (req, res) => {
  res.status(200).json({
    data: doItBeFartin,
    success: true,
  });
});

app.get("/doitbefartin/:boolean", (req, res) => {
  res.status(200).json({
    data: doItBeFartin,
    success: true,
  });
});

app.get("/doitmaybebefartin/:boolean", (req, res) => {
  res.status(200).json({
    data: doItBeFartin,
    success: true,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

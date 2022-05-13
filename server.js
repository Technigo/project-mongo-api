import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import doItBeFartin from "./data/doitbefartin.json";

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

// if (process.env.RESET_DB) {
// const seedDatabase = async () => {
//   await Animal.deleteMany();
//   doItBeFartin.forEach((animal) => {
//     new Animal(animal).save();
//   });
// };
// seedDatabase();
// }

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Route explanation
app.get("/", (req, res) => {
  res.send([
    { "/": "Home" },
    { "/animals": "All the animals" },
    { "/animal/:animal": "Find one animal" },
    { "/description/:boolean": "True or false if there a fart description" },
    { "/doitbefartin/:boolean": "True or false if it be fartin" },
    {
      "/doitmaybebefartin/:boolean": "True or false if it MAYBE be fartin",
    },
  ]);
});

// Route for all the animals
app.get("/animals", async (req, res) => {
  let animals = await Animal.find();
  res.status(200).json({
    data: animals,
    success: true,
  });
});

// Route for searching for a single animal by name
app.get("/animal/:animal", async (req, res) => {
  let animals = await Animal.find();

  animals = animals.filter((a) =>
    a.name.toLowerCase().includes(req.params.animal.toLocaleLowerCase())
  );

  if (animals) {
    res.status(200).json({ data: animals, success: true });
  } else {
    res.status(400).json({ error: "Animal not found" });
  }
});

// Route for if a description exists
app.get("/description/:boolean", async (req, res) => {
  let animals = await Animal.find();

  animals = animals.filter(
    (a) => a.descriptionExists.toString() === req.params.boolean.toString()
  );

  if (animals) {
    res.status(200).json({ data: animals, success: true });
  } else {
    res.status(400).json({ error: "Boolean incorrect. use true or false." });
  }
});

// Route true/false for if it be fartin
app.get("/doitbefartin/:boolean", async (req, res) => {
  let animals = await Animal.find();

  animals = animals.filter(
    (a) => a.doesItFart.toString() === req.params.boolean.toString()
  );

  if (animals) {
    res.status(200).json({ data: animals, success: true });
  } else {
    res.status(400).json({ error: "Boolean incorrect. use true or false." });
  }
});

// Route true/false for if it maybe be fartin
app.get("/doitmaybebefartin/:boolean", async (req, res) => {
  let animals = await Animal.find();

  animals = animals.filter(
    (a) => a.doesItMaybeFart.toString() === req.params.boolean.toString()
  );

  if (animals) {
    res.status(200).json({ data: animals, success: true });
  } else {
    res.status(400).json({ error: "Boolean incorrect. use true or false." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

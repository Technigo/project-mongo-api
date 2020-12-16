import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import volcanosData from "./data/volcanos.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/volcanos";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Volcano = new mongoose.model("Volcano", {
  Number: Number,
  Name: String,
  Country: String,
  Region: String,
  Type: String,
});

if (process.env.RESET_DATABASE) {
  const volcanoDatabase = async () => {
    await Volcano.deleteMany();

    volcanosData.forEach((item) => {
      const newVolcano = new Volcano(item);
      newVolcano.save();
    });
  };
  volcanoDatabase();
}

// const Volcano = mongoose.model("Volcano", {
//   name: String,
//   country: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Country",
//   },
// });

// const Name = mongoose.model("Name", {
//   name: String,
// });

// const Country = mongoose.model("Country", {
//   name: String,
// });

// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     await Name.deleteMany();

//     const larderello = new Name({ name: "Larderello" });
//     await larderello.save();

//     const dubbi = new Name({ name: "Dubbi" });
//     await dubbi.save();
//   };
//   seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// const Animal = mongoose.model("Animal", {
//   name: String,
//   age: Number,
//   isFurry: Boolean,
// });

// Animal.deleteMany().then(() => {
//   new Animal({ name: "Alfons", age: 2, isFurry: true }).save();
//   new Animal({ name: "Lucy", age: 5, isFurry: true }).save();
//   new Animal({ name: "Goldy the goldfish", age: 1, isFurry: false }).save();
// });

// Start defining your routes here

// app.get("/", (req, res) => {
//   Animal.find().then((animals) => {
//     res.json(animals);
//   });
// });

// app.get("/:name", (req, res) => {
//   Animal.findOne({ name: req.params.name }).then((animal) => {
//     if (animal) {
//       res.json(animal);
//     } else {
//       res.status(404).json({ error: "Not found" });
//     }
//   });
// });

// app.get("volcanos", async (req, res) => {
//   const volcanos = await Volcano.find();
//   res.json(volcanos);
// });

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/volcanos", async (req, res) => {
  const allVolcanos = await Volcano.find(req.query).limit(10);
  res.json(allVolcanos);
});

app.get("/volcanos/:name", async (req, res) => {
  const singleVolcano = await Volcano.findOne({ Name: req.params.name });

  res.json(singleVolcano);
});

// Having below version as ref:
app.get("/volcanos/country/:Country", (req, res) => {
  Volcano.find(req.params, (err, data) => {
    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

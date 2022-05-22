import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import femalesData from "./data/laureates.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8082;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Req: Your API should make use of Mongoose models to model your data and use these models to fetch data from the database.
// Modelling the database:
const Laureate = mongoose.model("Laureate", {
  id: Number,
  name: String,
  year: Number,
  country: String,
  category: String,
  description: String,
});

// Codealong - add to database code:
// const testUser = new User({
//   name: "Justyna Zwiazek",
//   id: 65,
//   category: "Peace",
// });
// console.log(testUser);
// testUser.save();

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    // deleti all items in the database to prevent to copy over the items
    await Laureate.deleteMany();

    femalesData.forEach((female) => {
      const newLaureate = new Laureate(female);
      newLaureate.save();
    });
  };
  seedDatabase();
}
// Endpoints on the landing page
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Req: A minimum of one endpoint to return a collection of results (array of elements)
app.get("/laureates", async (req, res) => {
  const { name, category } = req.query;

  try {
    const allLaureates = await Laureate.find({
      name: new RegExp(name, "i"),
      category: new RegExp(category, "i"),
    });
    res.json(allLaureates);
  } catch (error) {
    res
      .status(400)
      .json({ error: "We didn't find what you were looking for." });
  }
});

// Req: A minimum of one endpoint to return a single result (single element).
app.get("/laureates/id/:id", async (req, res) => {
  const { id } = req.params;
  const laureateById = await Laureate.findOne({ laureateID: id });

  if (!laureateById) {
    res
      .status(404)
      .json("Sorry, could not find a Nobel Prize laureate with this ID");
  } else {
    res.status(200).json(laureateById);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// this the import from json file.
import goldenGlobesData from "./data/golden-globes.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// copied from the instructions and change the name from person to nomination
const Nomination = mongoose.model("Nomination", {
  // this is the schema that tells the data base what kind of data we are expecting. like year-film, category and so on.
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean,
});

// this put the data from json into mongo db.
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Nomination.deleteMany({});

    goldenGlobesData.forEach((nominationData) => {
      new Nomination(nominationData).save();
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
  res.send("Hello Technigo!");
});

// copied this code from the express api projcet
// this is route one, where i get the full data about the nominations.
app.get("/nominations", (req, res) => {
  // this where  i get the data from mongo db and send it as json ...
  Nomination.find().then((results) => {
    res.json(results);
  });
});

// copied this code from the express api projcet
// async needs to be there because we are using await. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
// here we are replacing the json file. im now getting the data from mongo db.
// this is routw two where we get a specifc nomination.
app.get("/nominations/:id", async (req, res) => {
  const id = req.params.id; // if /nominations/1, req.params.id is 1
  const nomination = await Nomination.find().skip(Number(id)).limit(1).exec();
  // if we find something with that id, we return it. if not we return a 404.
  if (nomination) {
    res.json(nomination);
  } else {
    // remmber 404 means "not found". if it start with a 2 evertyhing is ok. if it starts with a 4 or 5 something is wrong. 4 means your request is wrong. 5 means the server is wrong.
    res.status(404).send(`No nomination with id ${id} found.`);
  }
});

// app.post("/nominations", (req, res) => { THIS WHERE I STOPPED AND HERE IS WHERE I START AGAIN 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/country";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Youtuber = mongoose.model("Youtuber", {
  name: String,
  id: Number,
});

const seedDatabase = async () => {
  const lindgren = new Youtuber({ name: "Therese Lindgren", id: 1 });
  await lindgren.save();

  const dietz = new Youtuber({ name: "Margaux Dietz", id: 2 });
  await dietz.save();

  const olsson = new Youtuber({ name: "Jon Olsson", id: 3 });
  await olsson.save();

  const guidetti = new Youtuber({ name: "Sanna Guidetti", id: 4 });
  await guidetti.save();

  const neistat = new Youtuber({ name: "Casey Neistat", id: 5 });
  await neistat.save();

  const delos = new Youtuber({ name: "Sv Delos", id: 6 });
  await delos.save();

  const delér = new Youtuber({ name: "Janni Delér", id: 7 });
  await delér.save();
};

seedDatabase();

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  // Displays all movies and shows
  //res.json(topMusicData);
  res.send("Hello World nu kör vi igen!!!");
});

app.get("/:youtubers", async (req, res) => {
  const youtubers = await Youtuber.find();
  res.json(youtubers);
});

app.get("/youtubers/:id", async (req, res) => {
  const youtubers = await Youtuber.find();
  res.json(youtubers);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

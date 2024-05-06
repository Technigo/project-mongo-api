import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import goldenGlobesData from "./data/golden-globes.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

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
app.get("/nominations", (req, res) => {
  res.json(goldenGlobesData);
});

// copied this code from the express api projcet
app.get("/nominations/:id", (req, res) => {
  const id = req.params.id; // if /nominations/1, req.params.id is 1
  const nomination = goldenGlobesData[parseInt(id)];
// if we find something with that id, we return it. if not we return a 404.
  if (nomination) {
    res.json(nomination);
  } else {
    // remmber 404 means "not found". if it start with a 2 evertyhing is ok. if it starts with a 4 or 5 something is wrong. 4 means your request is wrong. 5 means the server is wrong.
    res.status(404).send(`No nomination with id ${id} found.`);
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

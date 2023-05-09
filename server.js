import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/zoo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const zooSchema = new mongoose.Schema ({
  "animal_name": String,
  "hair": Number,
  "feathers": Number,
  "eggs": Number,
  "milk": Number,
  "airborne": Number,
  "aquatic": Number,
  "predator": Number,
  "toothed": Number,
  "backbone": Number,
  "breathes": Number,
  "venomous": Number,
  "fins": Number,
  "legs": Number,
  "tail": Number,
  "domestic": Number,
  "catsize": Number,
  "class_type": Number
})
const zooAnimal = mongoose.model("Zoo", zooSchema);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Zoo Page!");
});

app.get("/zooanimals", async (req, res) =>{
const zooAnimals = await zooAnimal.find()
res.json(zooAnimals)})
    


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

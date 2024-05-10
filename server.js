import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

//import data
import whoData from "./data/doctorwho.json";

dotenv.config();

//establish connection to MongoDB database using Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/doctorwho-data";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

//define schema
const { Schema } = mongoose;

const episodeSchema = new Schema({
  episode_title: String,
  doctor_actor: String,
  companion: String,
  summary: String,
  air_date: String,
});

//define model
const Episode = mongoose.model("Episode", episodeSchema);

//seed the database **outcoded because it's been seeded**
// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     console.log("resetting and seeding data!");
//     //clear existing data
//     await Episode.deleteMany();
//     //add episodes from json-file
//     whoData.forEach((episode) => {
//       new Episode(episode).save();
//     });
//   };
//   seedDatabase();
// }

//defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

//add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//middleware to check if database is available
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "service unavailable" });
  }
});

//routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

//1️⃣ endpoint that returns all episodes
//example: http://localhost:8080/episodes
app.get("/episodes", async (req, res) => {
  const allEpisodes = await Episode.find();
  res.json(allEpisodes);
});

//2️⃣ endpoint to return a single result defined by MongoDB_id
//example: http://localhost:8080/episodes/663cfb0ddd4f5638407bc5ae
app.get("/episodes/:episodeId", async (req, res) => {
  const { episodeId } = req.params;
  try {
    const episode = await Episode.findById(episodeId);

    if (episode) {
      res.json(episode);
    } else {
      res
        .status(404)
        .json({ message: `Episode with ID ${episodeId} not found` });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

//3️⃣ endpoint to return a single result defined by "air date"
//example: http://localhost:8080/episodes/airdate/2010-04-03
app.get("/episodes/airdate/:date", async (req, res) => {
  const { date } = req.params;

  const episode = await Episode.findOne({ air_date: date });

  if (episode) {
    res.json(episode);
  } else {
    res
      .status(404)
      .json({ message: `No episode found with air date: ${date}` });
  }
});

//4️⃣ endpoint to return episodes filtered by actor name
//example: http://localhost:8080/episodes/actor/jodie%20whittaker
app.get("/episodes/actor/:actorName", async (req, res) => {
  const { actorName } = req.params;
  //search for episodes where the actor matches the given name (case-insensitive because of $options: "i")
  const filteredEpisodes = await Episode.find({
    doctor_actor: { $regex: `^${actorName.trim()}$`, $options: "i" },
  });

  if (filteredEpisodes.length > 0) {
    res.json(filteredEpisodes);
  } else {
    res
      .status(404)
      .json({ message: `No episode found for actor: ${actorName}` });
  }
});

//5️⃣ endpoint to get a list of all doctor names
//example: http://localhost:8080/doctors
app.get("/doctors", async (req, res) => {
  //get doctor names using distinct
  const doctorNames = await Episode.distinct("doctor_actor");

  if (doctorNames.length > 0) {
    res.json(doctorNames);
  } else {
    res.status(404).json({ message: "No doctors found" });
  }
});

//6️⃣ endpoint to get a list of all companion names
//example: http://localhost:8080/companions
app.get("/companions", async (req, res) => {
  const companionNames = await Episode.distinct("companion");

  if (companionNames.length > 0) {
    res.json(companionNames);
  } else {
    res.status(404).json({ message: "No companions found" });
  }
});

//7️⃣ endpoint to get a list of episodes per year based on air_date
//example: http://localhost:8080/episodes/year/2021
app.get("/episodes/year/:year", async (req, res) => {
  const { year } = req.params;

  const filteredEpisodes = await Episode.find({
    air_date: { $regex: `^${year}` }, // ^ => match must start at beginning of the string
  });

  if (filteredEpisodes.length > 0) {
    res.json(filteredEpisodes);
  } else {
    res.status(404).json({ message: `No episodes found for year ${year}` });
  }
});

//start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

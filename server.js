import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';
import listEndpoints from "express-list-endpoints";

import astronautsData from "./data/nasa-astronauts.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/astronauts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Astronaut = mongoose.model("Astronaut", {
  id: Number,
  name: String,
  year: Number,
  group: Number,
  status: String,
  birthDate: String,
  birthPlace: String,
  gender: String,
  almaMater: String,
  underGraduateMajor: String,
  graduateMajor: String,
  militaryRank: String,
  militaryBranch: String,
  spaceFlights: Number,
  spaceFlight_hr: Number,
  spaceWalks: Number,
  spaceWalks_hr: Number,
  missions: String,
  deathDate: String,
  deathMission: String,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Astronaut.deleteMany();

    astronautsData.forEach((astronaut) => {
      const newAstronaut = new Astronaut(astronaut);
      newAstronaut.save()
    })
  };
  seedDatabase();
};

app.use(cors());
app.use(express.json());

app.set('json spaces', 2);

app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

app.get("/api/astronauts", async (req, res) => {
  const { missions } = req.query;

  const allAstronauts = await Astronaut.find();

  if (missions) {
    const filteredAstronauts = allAstronauts.filter((astronaut) => astronaut.missions.includes(missions))
    res.status(200).json({
      success: true,
      results: filteredAstronauts
    })
  } else {
    res.status(200).json({
      success: true,
      results: allAstronauts
    })
  }

});

app.get("/api/astronauts/:name", async (req, res) => {
  const { name } = req.params;

  const specificAstronaut = await Astronaut.findOne({ name: name });

  if (specificAstronaut) {
    res.status(200).json({
      success: true,
      astronaut: specificAstronaut
    })
  } else {
    res.status(404).json({
      success: false,
      status_code: 404,
      status_message: `Astronaut with the name of ${name} can't be found`
    })
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

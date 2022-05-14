import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import astronautsData from "./data/nasa-astronauts.json";
import missionsData from "./data/missions.json";

import astronautsRoute from "./routes/astronauts";
import missionsRoute from "./routes/missions";
import yearsRoute from "./routes/years";

import AstronautSchema from "./models/astronaut";
import MissionSchema from "./models/mission";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/astronauts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
dotenv.config();

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await AstronautSchema.deleteMany();
    await MissionSchema.deleteMany();

    astronautsData.forEach((astronaut) => {
      const newAstronaut = new AstronautSchema(astronaut);
      newAstronaut.save()
    });

    missionsData.forEach((mission) => {
      const newMission = new MissionSchema(mission);
      newMission.save()
    })
  };
  seedDatabase();
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      status_code: 503,
      status_message: "Service Unavailable"
    })
  };
});

app.use("/api/astronauts", astronautsRoute);
app.use("/api/missions", missionsRoute);
app.use("/api/years", yearsRoute);

app.set('json spaces', 2);

app.get("/", (req, res) => res.json(listEndpoints(app)));

app.get('*', (req, res) => res.status(404).send("Not Found"));

app.listen(port);

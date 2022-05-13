import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';
import listEndpoints from "express-list-endpoints";

import astronautsData from "./data/nasa-astronauts.json";
import astronautsRoute from "./routes/astronauts";
import AstronautSchema from "./models/astronaut";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/astronauts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await AstronautSchema.deleteMany();

    astronautsData.forEach((astronaut) => {
      const newAstronaut = new AstronautSchema(astronaut);
      newAstronaut.save()
    })
  };
  seedDatabase();
};

app.use(cors());

app.use(express.json());
app.use("/api/astronauts", astronautsRoute)

app.set('json spaces', 2);

app.get("/", (req, res) => res.json(listEndpoints(app)));

app.listen(port);

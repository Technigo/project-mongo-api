import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import connectDB from "./config/db";

import astronautsRoute from "./routes/astronauts";
import missionsRoute from "./routes/missions";
import yearsRoute from "./routes/years";

dotenv.config();

connectDB();

const app = express();

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

const port = process.env.PORT || 8080;

app.listen(port);

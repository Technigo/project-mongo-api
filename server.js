import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import listEndpoints from "express-list-endpoints";

import f1Data from "./data/f1-2020-data.json";

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const DriverSchema = new Schema({
    permanentNumber: String,
    code: String,
    givenName: String,
    familyName: String,
    dateOfBirth: String,
    nationality: String,
});

const ConstructorSchema = new Schema({
    constructorId: String,
    nationality: String,
});

const ResultSchema = new Schema({
    number: String,
    position: String,
    points: String,
    Driver: DriverSchema,
    Constructor: ConstructorSchema,
    grid: String,
    laps: String,
});

const Race = mongoose.model("Race", {
    season: String,
    round: String,
    url: String,
    raceName: String,
    date: String,
    results: [ResultSchema],
});

if (process.env.RESET_DB) {
    Race.deleteMany().then(
        f1Data.MRData.RaceTable.Races.forEach((race) => {
            new Race({
                season: race.season,
                round: race.round,
                url: race.url,
                raceName: race.raceName,
                date: race.date,
                results: race.Results,
            }).save();
        })
    );
}

// Start defining your routes here

app.get("/", (req, res) => {
    res.send(listEndpoints(app))
});

app.get("/races", (req, res) => {
    Race.find().then((races) => {
        res.json(races);
    });
});

app.get("/races/:round", (req, res) => {
    Race.findOne({ round: req.params.round }).then((race) => {
        if (race) {
            res.json(race);
        } else {
            res.status(404).json({ error: "race not found, try rounds between 1-17" });
        }
    });
});

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on http://localhost:${port}`);
});

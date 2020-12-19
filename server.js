import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import volcanosData from "./data/volcanos.json";
import Volcano from "./models/volcanos";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/volcanos";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Type = new mongoose.model("Type", {
  description: String,
});

if (process.env.RESET_DATABASE) {
  const volcanoDatabase = async () => {
    await Volcano.deleteMany();
    console.log("populating database");
    volcanosData.forEach((item) => {
      const newVolcano = new Volcano(item);
      newVolcano.save();
    });
  };
  volcanoDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

// async version
app.get("/volcanos", async (req, res) => {
  console.log("query", req.query);

  const { Name, Country, sort, height, page, limit = 20 } = req.query;
  const volcanoRegex = new RegExp(`\\b${Name}\\b`, "i");

  const findVulcanos = () => {
    if (Name) return { Name: volcanoRegex };
    if (Country) return { Country };
    if (height) return { ElevationMeters: { $gte: height } };
  };

  const sortVulcanos = () => {
    if (sort === "name") return { Name: 1 };
    if (sort === "height") return { ElevationMeters: -1 };
    if (sort === "country") return { Country: 1 };
  };

  const filteredVolcanos = await Volcano.find(findVulcanos())
    .sort(sortVulcanos())
    .skip((page - 1) * limit)
    .limit(limit);
  res.json(filteredVolcanos);
});

// promises version
app.get("/volcanos/:name", (req, res) => {
  Volcano.findOne({ Name: req.params.name })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json({ error: "Invalid name" });
    });
});

// mongoose version
app.get("/volcanos/country/:Country", (req, res) => {
  Volcano.find(req.params, (err, data) => {
    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

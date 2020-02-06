import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// import netflixData from "./data/netflix-titles.json";

// Example json structure

// {
//   "show_id": 81193313,
//   "title": "Chocolate",
//   "director": "",
//   "cast": "Ha Ji-won, Yoon Kye-sang, Jang Seung-jo, Kang Bu-ja, Lee Jae-ryong, Min Jin-woong, Kim Won-hae, Yoo Teo",
//   "country": "South Korea",
//   "date_added": "November 30, 2019",
//   "release_year": 2019,
//   "rating": "TV-14",
//   "duration": "1 Season",
//   "listed_in": "International TV Shows, Korean TV Shows, Romantic TV Shows",
//   "description": "Brought together by meaningful meals in the past and present, a doctor and a chef are reacquainted when they begin working at a hospice ward.",
//   "type": "TV Show"
// },

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix-titles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Director = mongoose.model("Director", {
  name: String
});

const seedDatabase = async () => {
  await Director.deleteMany();

  const ara = new Director({ name: "Luis Ara" });
  await ara.save();

  const sharma = new Director({ name: "Abhishek Sharma" });
  await sharma.save();
};

seedDatabase();

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/directors", async (req, res) => {
  const directors = await Director.find();
  res.json(directors);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix-titles";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Director = mongoose.model("Director", {
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  titles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Title" }]
});

const Title = mongoose.model("Title", {
  title: String,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director"
  },
  cast: String,
  country: String,
  release_year: Number,
  type: String
});

const seedDatabase = async () => {
  await Director.deleteMany();
  await Title.deleteMany();

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const uniqNetflixData = netflixData.filter(title => title.director !== "");

  const directors = uniqNetflixData.map(title => title.director).filter(distinct);

  directors.forEach(async director => {
    const newDirector = new Director({
      _id: mongoose.Types.ObjectId(),
      name: director
    });

    const directorsTitles = netflixData.filter(
      title => title.director !== "" && title.director === director
    );

    directorsTitles.forEach(async title => {
      const newTitle = new Title({
        title: title.title,
        director: newDirector._id,
        cast: title.cast,
        country: title.country,
        release_year: title.release_year,
        type: title.type
      });
      newDirector.titles.push(newTitle);
      await newTitle.save();
    });
    await newDirector.save();
  });
};

seedDatabase();

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send(netflixData);
});

app.get("/directors", async (req, res) => {
  const directors = await Director.find();
  res.json(directors);
});

app.get("/directors/:id", async (req, res) => {
  const director = await Director.findById(req.params.id).populate("titles");
  res.json(director);
});

app.get("/titles", async (req, res) => {
  const titles = await Title.find().populate("director");
  res.json(titles);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

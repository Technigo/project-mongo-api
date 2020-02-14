import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

//

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Movie = mongoose.model("Movie", {
  show_id: {
    type: Number
  },
  title: {
    type: String
  },
  director: {
    type: String
  },
  cast: {
    type: String
  },
  Country: {
    type: String
  },
  date_added: {
    type: Number
  },
  release_Year: {
    type: Number
  },
  rating: {
    type: String
  },
  duration: {
    type: String
  },
  listed_In: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String
  }
});

const addMovieToDatabase = () => {
  netflixData.forEach(movie => {
    new Movie(movie).save();
  });
};
addMovieToDatabase();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

if (process.env.RESET_DATABASE) {
  console.log("Resetting database!"); //Use this command in terminal RESET_DATABASE=true npm run dev

  app.get("/movie", (req, res) => {
    const queryString = req.query.q;
    const queryRegex = new RegExp(queryString, "i");
    Movie.find({ title: queryRegex })
      .sort({ rating: -1 })
      .then(results => {
        // Succesfull
        console.log("Found : " + results);
        res.json(results);
      })
      .catch(err => {
        // Error/Failure
        console.log("Error " + err);
        res.json({ message: "Cannot find this movie", err: err });
      });
  });

  app.get("/movie/:director", (req, res) => {
    console.log(`req.params.director: ${req.params.director}`);
    const director = req.params.director;
    Movie.findOne({ director: director })
      .then(results => {
        res.json(results);
      })
      .catch(err => {
        res.json({ message: "Cannot find this director", err: err });
      });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

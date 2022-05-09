import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// })

const Show = mongoose.model("Show", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
})

Show.deleteMany().then(() => {
  new Show({ show_id: '14', title: 'The Wallbergs', director: 'Hanna Wallberg', cast: 'The whole family', country: 'Sweden', date_added: 'June 08, 2017', release_year: '2014', rating: 'TV-14', duration: '7 Seasons', listed_in: 'Reality TV', description: 'Can you keep up with this crazy family? Either can they.', type: 'TV Show'}).save()
  new Show({ show_id: '15', title: 'Hanna and Ted take Sköndal', director: 'Hanna Wallberg', cast: 'Hanna, Ted', country: 'Sweden', date_added: 'February 24, 2022', release_year: '2022', rating: 'TV-14', duration: '1 Season', listed_in: 'Reality TV', description: 'In this spin-off we follow Hanna and Ted and their familys move to Sköndal', type: 'TV Show'}).save()
})
// const testUser = new User({name: "Maksy", age: 28, deceased: false});
// testUser.save()

// if(process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Show.deleteMany();
//     netflixData.forEach( stream => {
//       const newStream = new Show(stream);
//       newShow.save();
//     })
//   }
// }

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// My routes
app.get("/", (req, res) => {
  Show.find().then(shows => {
    res.json(shows)
  })
});

app.get('/:title', (req, res) => {
  Show.findOne({title: req.params.title}).then(show => {
    if(show) {
      res.json(show)
    } else {
      res.status(404).json({error: 'Not found'})
    }
  })
})

app.get("/stream", (req, res) => {
  res.status(200).json(netflixData)
});

app.get("/stream/year/:year", (req, res) => {
  const { year } = req.params;
  const streamByYear = netflixData.filter((stream => stream.release_year === +year))
  streamByYear
    ? res.status(200).json({ data: streamByYear })
    : res.status(400).json({ error: "Not found" })
})

app.get("/stream/title/:title", (req, res) => {
  const { title } = req.params;
  const streamByTitle = netflixData.find(stream => stream.title.toLowerCase() === title.toLowerCase())
  streamByTitle
    ? res.status(200).json({ data: streamByTitle })
    : res.status(400).json({ error: "Not found" })
})

app.get("/stream/type/:type", (req, res) => {
  const { type } = req.params;
  const streamByTitle = netflixData.filter(stream => stream.type.toLowerCase() === type.toLowerCase())
  streamByTitle
    ? res.status(200).json({ data: streamByTitle })
    : res.status(400).json({ error: "Not found" })
})

// Start the server
app.listen(port, () => {
  console.log(`Hello worlds!`)
  console.log(`Server running on http://localhost:${port}`);
});

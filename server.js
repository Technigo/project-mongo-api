import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
 
import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Movie = new mongoose.model('Movie', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany();

    goldenGlobesData.forEach(item => {
      const newMovie = new Movie(item);
      newMovie.save();
    });
  }
  seedDatabase();
}


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Golden Globes API where you can find information about all the movies nominated')
});

//This returns all movie nominations
app.get('/movies', async (req, res) => {
  const queryParameters = req.query;
  const allMovies = await Movie.find(req.query);
  res.json(allMovies);
});

//This returns one single movie based on the name of the nomineed movie
app.get('/movies/nominee/:nominee', async (req, res) => {
  const { nominee } = req.params;

  const singleNominee = await Movie.findOne({ nominee: req.params.nominee });
  
  res.json(singleNominee);
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

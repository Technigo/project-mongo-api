import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
 
import goldenGlobesData from './data/golden-globes.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//Middlewares to enable cors and json body parsing
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

//To avoid that the data duplicates everytime you seed the database, we have to do deleteMany before you seed the database.
//Here we say if we reset the database by doing RESET_DB=true npm run dev, then delete the data and seed the database.
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany();

//Here we take all the data from the whole array and for each item we create a Movie model
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

//This returns all movie nominations. Then we have a universal query param to filter based on any property.
//For example you can search http://localhost:8080/movies?win=true&year_film=2009 and get all the movies that won for films released in 2009
app.get('/movies', async (req, res) => {
  const allMovies = await Movie.find(req.query);

  if (allMovies.length > 0) {
    res.json(allMovies);
  } else {
    res.status(400).json({ error: 'Invalid entry' });
  }
});

//This returns one single movie based on the id of the nominee
app.get('/movies/:id', async (req, res) => {
  try {
    const singleNominee = await Movie.findOne({ _id: req.params.id }); 
    res.json(singleNominee); 
  } catch {
    res.status(404).json({ error: 'Invalid nominee'});
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// For this setup to work, two Config Vars need to be added in Heroku:
// MONGO_URL should be equal to the connection string generated in MongoDB Cloud Atlas
// for this project. The PW, the user name & test should be replaced in the link from MongoDB.
// RESET_DB with value true 
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// Mongoose connection
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://elimberkat:computer2018@cluster0.txs9zbq.mongodb.net/project-mongo?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('strictQuery', false); // Handle Mongoose deprecation warning

// MongoDB Models
const Cast = mongoose.model('Cast', {
  name: String,
});

const Movie = mongoose.model('Movie', {
  title: String,
  cast: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cast',
  }],
});

// Seed Database Function
const seedDatabase = async () => {
  await Cast.deleteMany();
  await Movie.deleteMany();

  const castMap = new Map();

  netflixData.forEach(item => {
    const castList = item.cast.split(', ');

    castList.forEach(async name => {
      if (!castMap.has(name)) {
        const cast = new Cast({ name });
        await cast.save();
        castMap.set(name, cast._id);
      }
    });
  });

  const movies = [];
  netflixData.forEach(item => {
    const movie = new Movie({
      title: item.title,
      cast: item.cast.split(', ').map(name => castMap.get(name)),
    });
    movies.push(movie);
  });

  await Promise.all(movies.map(async movie => {
    await movie.save();
  }));
};

// Update Movies Function
const updateMovies = async () => {
  try {
    const casts = await Cast.find();

    for (const entry of netflixData) {
      await Movie.updateOne(
        { title: entry.title },
        {
          $set: {
            cast: entry.cast.split(', ').map((actorName) => {
              const castMember = casts.find((cast) => cast.name === actorName);
              return castMember ? castMember._id : null;
            }),
          },
        }
      );
    }

    console.log('Movies updated successfully!');
  } catch (error) {
    console.error('Error updating movies:', error);
  }
};

// Run Seed and Update Functions
seedDatabase();
updateMovies();

// Express app
const port = process.env.PORT || 27017;
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/home", (req, res) => {
  res.send(netflixData);
});

app.get("/movies", async (req, res) => {
  const movies = await Movie.find().populate('cast');
  res.json(movies);
});

app.get('/movies/cast', async (req, res) => {
  const cast = await Cast.find();
  res.json(cast);
});

app.get('/movies/cast/:id', async (req, res) => {
  try {
    console.log('Requested Cast ID:', req.params.id);

    const cast = await Cast.findById(req.params.id);
    if (!cast) {
      console.log('Cast not found');
      return res.status(404).json({ error: 'Cast not found' });
    }

    const movies = await Movie.find({ cast: cast._id }).populate('cast');

    console.log('Found Cast:', cast);
    console.log('Movies:', movies);

    res.json({ cast, movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('cast');
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, log the error to a monitoring service
});

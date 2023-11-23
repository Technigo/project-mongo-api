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

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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

const seedDatabase = async () => {
  await Cast.deleteMany();
  await Movie.deleteMany();

  const castMap = new Map(); // To track existing cast to avoid duplicates

  // Populate Cast collection
  netflixData.forEach(item => {
    const castList = item.cast.split(', ');

    castList.forEach(async name => {
      // Deduplicate cast names
      if (!castMap.has(name)) {
        const cast = new Cast({ name });
        await cast.save();
        castMap.set(name, cast._id);
      }
    });
  });

  // Populate Movie collection
  const movies = [];
  netflixData.forEach(item => {
    const movie = new Movie({
      title: item.title,
      cast: item.cast.split(', ').map(name => castMap.get(name)),
    });
    movies.push(movie);
  });

  // Save all movies to avoid CastError
  await Promise.all(movies.map(async movie => {
    await movie.save();
  }));
};

const updateMovies = async () => {
  try {
    // Retrieve all casts from the Cast collection
    const casts = await Cast.find();

    // Loop through each entry in netflixData and update the corresponding movie document
    for (const entry of netflixData) {
      // Update the movie document in the MongoDB collection
      await Movie.updateOne(
        { title: entry.title },
        {
          $set: {
            cast: entry.cast.split(', ').map((actorName) => {
              // Find the cast member by name and get their _id
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

// Call the function to update movies
updateMovies();

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/home", (req, res) => {
  res.send(netflixData);
});

app.get("/movies", async (req, res) => {
  // Retrieve movies with populated cast information
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

    // Use populate to retrieve movies information for the given cast
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

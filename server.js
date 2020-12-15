import express, { request, response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
import topMusicData from './data/top-music.json';

// Connection to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Song model
const Song = mongoose.model('Song', {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});

// Function to start seeding database 
//IMPORTANT: 
// With this setup two Config Vars need to be added on Heroku
// - MONGO_URL: connection string generated in MongoDB Cloud Atlas
// - RESET_DB: with value true so the seedDatabase function is called
if (process.env.RESET_DB) { 
  console.log('Resetting Database!');

  const seedDatabase = async () => { 
    await Song.deleteMany({});

    topMusicData.forEach((songData) => { 
      new Song(songData).save();
    });
  };
  seedDatabase()
};


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/', (request, response) => {
  response.send('Oh Hello! Welcome to Top Songs API, on MongoDB!')
});

// Route to get all top songs data 
app.get('/topsongs', async (request, response) => {
  const allSongs = await Song.find();
  response.json(allSongs);
});

// Route to get song by id
app.get('/topsongs/songs/:id', async (request, response) => { 
    const song = await Song.findOne({ id: request.params.id });
    if (song) { 
      response.json(song);
    } else { 
      response.status(404).json({ error: 'Oh No! Song not found'});
    };
});

// Route to get the most popular songs 
app.get('/topsongs/most-popular', async (request, response) => {
  const mostPopular = await Song.find({ popularity: { $gte: 90 } });
  response.json(mostPopular);
});

//Search from genre?

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
}); 

// NOTE: $gte is the MongoDB comparison operator 
// https://docs.mongodb.com/manual/reference/operator/query/gte/


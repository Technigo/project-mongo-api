import express, { request, response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

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
// IMPORTANT: 
// With this setup two Config Vars needed to be added on Heroku
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
  seedDatabase();
};

// Defines the port the app will run on. 
// Can be overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// ROUTES
app.get('/', (request, response) => {
  response.send('Oh Hello! Welcome to Top Songs API, on MongoDB!');
});

// Route to get all top songs data + request query for genre
// i.e. topsongs?genre=pop
//Added a Regex to return all the genres that include a certain word, 
//since the genres are several words on the same string, not case sensitive.
app.get('/topsongs', async (request, response) => {
  const { genre } = request.query;
  let conditions = {}; 

  if (genre) { 
    conditions = {genre: { $regex: genre , $options: 'i' }}
  };
  const songs = await Song.find(conditions);
  if (songs.length === 0) {
    response.status(404).json({ error: 'Bummer! That genre is not in the Top Songs'});
  };
  response.json(songs);
});

// Route to get the most popular top songs 
app.get('/topsongs/most-popular', async (request, response) => {
  const mostPopular = await Song.find({ popularity: { $gte: 90 } });
  response.json(mostPopular);
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

//Route to get songs by artist 
//Added a Regex to return all the artists with a matching string, not case sensitive
app.get('/topsongs/artists/:artistName', async (request, response) => { 
  const artistParams = request.params.artistName;
  const artist = await Song.find({artistName: { $regex: artistParams, $options: 'i' }});
  if(artist.length > 0) {
    response.json(artist)
  } else { 
    response.status(404).json({ error: 'Oh bummer! That artist is not on Top Songs (yet!)'});
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
}); 

// NOTE: $gte is the MongoDB comparison operator 
// https://docs.mongodb.com/manual/reference/operator/query/gte/

// Regex in MongoDB https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex

//Other Approach to get song by genre without a request query
//Route to get songs by genre 
// app.get('/topsongs/genre/:genre', async (request, response) => { 
//   const genreParams = request.params.genre;
//   const songs = await Song.find({genre: { $regex: genreParams, $options: 'i' }});
//   if(songs.length > 0) {
//     response.json(songs)
//   } else { 
//     response.status(404).json({ error: 'Oh bummer! That genre is not on the Top Songs'});
//   };
// });

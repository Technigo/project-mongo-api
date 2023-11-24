import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import topMusicData from './data/top-music.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
  popularity: Number,
});

// if (process.env.RESET_DB) {
// const seedDatabase = async () => {
//   await Song.deleteMany({});

//   topMusicData.forEach((topMusicData) => {
//     new Song(topMusicData).save();
//   });
// };
// seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// -----------------  Endpoint GET to fetch all songs -----------------
app.get('/songs', async (req, res) => {
  try {
    // Fetch all songs from the database
    const songs = await Song.find();

    // Check if any songs were found
    if (songs.length > 0) {
      // Respond with the list of songs
      res.json(songs);
    } else {
      // If no songs were found, return a 404 error
      res.status(404).json({ error: 'NO songs found' });
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

//-----------------  Endpoint GET to fetch an individual song by ID -----------------
app.get('/songs/:id', async (req, res) => {
  try {
    // Get the song ID from the request parameters
    const songID = parseInt(req.params.id);
    // Find the song in the database by ID
    const song = await Song.find({ id: songID });

    // Check if a song with the given ID was found
    if (song && song.length > 0) {
      // Respond with the details of the individual song
      res.json(song);
    } else {
      // If no song was found, return a 404 error
      res.status(404).json({ error: `Song with id ${songID} not found.` });
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

//-----------------  Endpoint GET to fetch songs by artist -----------------
app.get('/songs/artist/:artist', async (req, res) => {
  try {
    // Get the artist name from the request parameters
    const artistName = req.params.artist.toLowerCase();
    // Find songs in the database by artist name (case-insensitive)
    const artist = await Song.find({ artistName: { $regex: artistName, $options: 'i' } });

    // Check if any songs by the artist were found
    if (artist && artist.length > 0) {
      // Respond with the list of songs by the specified artist
      res.json(artist);
    } else {
      // If no songs were found, return a 404 error
      res.status(404).json({ error: `No songs found for the artist '${artistName}'` });
    }
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

///-----------------  Endpoint POST to add a new song -----------------
app.post('/songs/add', async (req, res) => {
  try {
    // Extract the new song data from the request body
    const newSongData = req.body;

    // Check if valid data for creating a new song is provided
    if (!newSongData) {
      // If data is invalid, return a 400 error
      return res.status(400).json({ error: 'Invalid data for creating a new song.' });
    }

    // Create a new song using the provided data
    const newSong = new Song(newSongData);
    // Save the new song to the database
    const savedSong = await newSong.save();

    // Respond with the details of the newly created song
    res.status(201).json(savedSong);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ error: 'Could not create a new song.' });
  }
});

//----------------- Endpoint DELETE to delete a song -----------------
app.delete('/songs/delete/:id', async (req, res) => {
  try {
    // Get the song ID from the request parameter
    const songID = parseInt(req.params.id);
    // Check if a song with the given ID exists
    const song = await Song.findOne({ id: songID });
    // If the song doesn't exist, return a 404 error
    if (!song) {
      return res.status(404).json({ error: `Song with id ${songID} not found.` });
    }
    // Delete the song from the database
    await Song.deleteOne({ id: songID });
    // Return a success message after deleting the song
    res.json({ message: `Song with id ${songID} has been deleted.` });
  } catch (error) {
    // In case of an error, return an appropriate status and error message
    res.status(500).json({ error: 'Could not delete the song.' });
  }
});

// Endpoint PUT to update data for a song in the database by ID
app.put('/songs/update/:id', async (req, res) => {
  try {
    // Get the song ID from the request parameter
    const songID = parseInt(req.params.id);

    // Get the updated data from the request body
    const updatedData = req.body;

    // Check if a song with the given ID exists
    const existingSong = await Song.findOne({ id: songID });

    // If the song doesn't exist, return a 404 error
    if (!existingSong) {
      return res.status(404).json({ error: `Song with id ${songID} not found.` });
    }

    // Update the song data in the database
    const updatedSong = await Song.findOneAndUpdate(
      { id: songID },
      { $set: updatedData },
      { new: true }, // Option to return the updated document
    );

    // Return the updated song data in JSON format
    res.json(updatedSong);
  } catch (error) {
    // Return a 500 error if an unexpected error occurs
    res.status(500).json({ error: 'Could not update the song.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

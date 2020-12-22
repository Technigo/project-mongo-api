import express from 'express'
import bodyParser, { json } from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Mongoose models 
const Artist = new mongoose.model('Artist', {
  name: String
});

const Tracks = new mongoose.model('Tracks', {
  id: Number,
  trackName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  length: Number,
  popularity: Number,
  artistName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }
});

// Populating database 

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    // Prevent getting multiple same responses, this starts with deleting what is existing
    await Tracks.deleteMany();
    await Artist.deleteMany();

    // topMusicData.forEach(item => {
    //   const newTracks = new Tracks(item)
    //   newTracks.save();
    // });

    // Create an array with unique tracks from topMusicData 
    const allArtists = topMusicData.map((item) => item.artistName)
    const uniqueArtists = Array.from(new Set(allArtists));

    // Create an array of artist object following the mongoose model 
    let artists = [];

    uniqueArtists.forEach(async artist => {
      const newArtist = new Artist({ name: artist });

      artists.push(newArtist);
      await newArtist.save();
    });

    //Creates an array of the tracks objects according to the mongoose model
    topMusicData.forEach(async trackItem => {
      const newTrack = new Tracks({
        ...trackItem,
        artistName: artists.find((artist) => artist.name === trackItem.artistName)
      });
      await newTrack.save();
    })
  };
  populateDatabase();
};

// A middleware to handle server connections errors 
app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) {
      next();
    } else {
      res.status(500).json({ error: "Service unavailable" });
  }
});

// Routes 
app.get('/', (req, res) => {
  res.send('Welcome to the music API')

});

// Route to all tracks
app.get('/tracks', async (req, res) => {
  const allTracks = await Tracks.find();
  res.json(allTracks)
});

// Route to find a specific track per id 
app.get('/tracks/:id', async (req, res) => {
  try {
  const singleTracks = await Tracks.findOne({ id: req.params.id })
  if (singleTracks) {
    res.json(singleTracks);
  } else {
    res.status(404).json({ error: 'Could not find this track' });
  }
} catch (error) {
  res.status(400).json({ error: 'Invalid track id' });
}
});

// Route to search by tracknamr
app.get('/tracks/:name', async (req, res) => {
  const { name } = req.params;
  const singleName = await Tracks.findOne({ trackName: name })
  res.json(singleName);
});

// Limiting returning data
app.get('/tracks20', async (req, res) => {
  const allTracks = await Tracks.find(req.query).skip(20).limit(20);
  res.json(allTracks);
});

// Get all artists 
app.get('/artists', async (req, res) => {
  const allArtist = await Artist.find();
    res.json(allArtist); 
    console.log(allArtist)
});

// Route all tracks by a certain artist 
app.get('/artists/:id/tracks', async (req, res) => {
  const artist = await Tracks.findById(req.params.id);

  if (artist) {
    const tracks = await Tracks.find({ artistName: mongoose.Types.ObjectId(artist.id) });
    res.json(tracks);
  } else {
    res.status(404).json({error: 'Artist not found!' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});

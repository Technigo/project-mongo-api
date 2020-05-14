import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Track = mongoose.model('Track', {
  id: {
    type: Number,
  },
  trackName: {
    type: String,
  },
  artistName: {
    type: String,
  },
  genre: {
    type: String,
  },
  popularity: {
    type: Number,
  }
});

const Artist = mongoose.model('Artist', {
  artistName: {
    type: String,
  }
});

if (process.env.RESET_DB) {
  console.log('Resetting database!');

  const seedDatabase = async () => {
    await Track.deleteMany();
    await Artist.deleteMany();
    topMusicData.forEach((trackdata) => {
      new Track(trackdata).save();
      new Artist(trackdata).save();
    });
  };
  seedDatabase();
}

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Start defining routes here
app.get('/', (req, res) => {
  res.send('Hello topMusic')
})

app.get('/allData', (req, res) => {
  res.json(topMusicData)
})

//Find tracks and chosen track with query:
/*
app.get('/tracks', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i');
  const tracks = await Track.find({ trackName: queryRegex });
  console.log(`Found ${tracks.length} tracks.`);
  res.json(tracks)
})
*/

//Find tracks:
app.get('/tracks', async (req, res) => {
  const tracks = await Track.find(); //populate('artist');
  //console.log(`The artist of ${tracks[0].trackName} is ${tracks[0].artist.artistName}`);
  res.json(tracks)
  console.log(`Found ${tracks.length} tracks.`);
})

//Find tracks in chosen genre with paths:
app.get('/tracks/:genre', async (req, res) => {
  const { genre } = req.params
  const tracks = await Track.find()
  let tracksInGenre = tracks.filter((item) => item.genre.toLowerCase() === genre.toLowerCase())
  if (tracksInGenre.length > 0) {
    res.json(tracksInGenre)
  } else {
    res.status(404).json({ error: `Could not find any tracks within the ${genre} genre` })
  }
})

//Find artists and chosen artist with query
/*
app.get('/artists', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i');
  const artists = await Artist.find({ artistName: queryRegex });
  console.log(`Found ${artists.length} artists.`);
  res.json(artists)
})
*/

//Find artists
app.get('/artists', async (req, res) => {
  const artists = await Artist.find();
  console.log(`Found ${artists.length} artists.`);
  res.json(artists)
})

//Find chosen artist with paths
app.get('/artists/:artistName', async (req, res) => {
  const { artistName } = req.params;
  const artist = await Artist.findOne({ artistName: artistName });
  if (artist) {
    res.json(artist)
  } else {
    res.status(404).json({ error: `Could not find the artist with artistName=${artistName}` })
  }
})

//Find all tracks by chosen artists with paths
app.get('/artists/:artistName/tracks', async (req, res) => {
  const { artistName } = req.params;
  const artist = await Artist.findOne({ artistName: artistName });
  if (artist) {
    const tracks = await Track.find({ artistName: artistName }).sort({ popularity: -1 })
    res.json(tracks)
  } else {
    res.status(404).json({ error: `Could not find any track by ${artistName}` })
  }
})

//Sort chosen track by chosen artist on popularity
/*
app.get('/tracks', async (req, res) => {
  const { trackName, artistName, sort } = req.query
  const trackNameRegex = new RegExp(trackName, 'i')
  const artistNameRegex = new RegExp(artistName, 'i')

  const sortQuery = (sort) => {
    if (sort === 'rating') {
      return { popularity: -1 }
    }
  }

  const tracks = await Track.find({
    trackName: trackNameRegex,
    artistName: artistNameRegex
  })
    .sort(sortQuery(sort))

  res.json(tracks)
})
*/

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

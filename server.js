import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


const Record = new mongoose.model('Record', {
  id: Number,
  trackName:String,
  artistName:String,
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

//populating database

if(process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Record.deleteMany();
    topMusicData.forEach(async item => {
      const newRecord = new Record(item);
      await newRecord.save();
    })
  }
  populateDatabase();
}

//error of server

app.use((req, res, next) => {
if(mongoose.connection.readyState === 1) {
  next()
} else {
  res.status(503).json({error: "Service unavailable"})
}
})

//Start defining your routes here
// app.get('/', (req, res) => {
//   //fetch('...', {headers: { Authorization: "my secret api key"}})
//   res.send(process.env.API_KEY)
//   })

app.get('/', (req, res) => {
    res.send('Hello world')
  })
//here we can see all records and query by every record and a combination of them
  app.get('/records', async (req, res) => {
  const allRecords = await Record.find(req.query);
  res.json(allRecords)
  })
//how to make it dynamic 20, 30 etc
app.get('/records20', async (req, res) => {
  const allRecords = await Record.find(req.query).skip(20).limit(20);
    res.json(allRecords)
  })

app.get('/records/id/:id', async (req, res) => {
  const recordByID = await Record.findOne({ id: req.params.id });
  if(recordByID) {
    res.json(recordByID);
  } else { 
    response.status(404).json({ error: 'Song not found'});
    };
  });

//provided by mongoose finds specific endpoints
// app.get('/records/artist_name/:artistName', (req,res) => {
//   Record.find(req.params, (err,data) => {
//     res.json(data);
//   })
// })

//regex 
app.get('/records/artists/:artistName', async (req,res) => {
  const artistByNameSearch = req.params.artistName;
  const artist = await Record.find({artistName:{ $regex: artistByNameSearch, $options: "i" }});
  //const artist = await Record.find({artistName:{ $regex: "\\b" + artistNameSearch + "\\b", $options: "i" }});
  if(artist.length > 0) {
    res.json(artist)
  } else { 
    res.status(404).json({ error: 'No such artist found'});
  };
});

//find short songs
app.get('/records/short', async (req, res) => {
  const shortRecords = await Record.find({ length: { $lt: 170 } });
  res.json(shortRecords);
});
//find dancable songs
app.get('/topsongs/dance', async (req, res) => {
  const dancingRecords = await Record.find({ danceability: { $gte: 80 } });
  res.json(dancingRecords);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});

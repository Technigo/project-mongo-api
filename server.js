import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


//import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
import topMusicData from './data/top-music.json'

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

// app.get('/records/:genre', (req,res) => {
//   Record.find({genre: req.params.genre}).then(record => {
//       res.json(record);
//     })
//     .catch(error => {
//       res.status(400).json({error: 'Not found'});
    
//   })
// })
//empty array
app.get('/records/:trackName', (req, res) => {
  Record.findOne({ trackName: req.params.trackName })
    .then(data => {
      res.json(data)
  })
    .catch(error => {
      res.status(400).json({error: 'Not found'});
  })
  })

//provided by mongoose finds specific endpoints
app.get('/records/artist_name/:artistName', (req,res) => {
  Record.find(req.params, (err,data) => {
    res.json(data);
  })
})

//dont know if it works, probably unnecessary as queries are used fir everything
app.get('/records/popularity', (req,res) => {
  Record.find({popularity: req.params.popularity })
    .then(record => {
      res.json(record);
    })
    .catch(error => {
      res.status(400).json({error: 'Not found'}); 
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

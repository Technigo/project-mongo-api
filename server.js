import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const TopMusic = mongoose.model('TopMusic', {
        id: {
          type: Number},
        trackName: {
          type: String},
        artistName: {
          type: String},
        genre: {
          type: String},
        bpm: {
          type: Number},
        energy: {
          type: Number},
        danceability: {
          type: Number},
        loudness: {
          typr: Number},
        liveness: {
          type: Number},
        valence: {
          type: Number},
        length: {
          type: Number},
        acousticness: {
          type: Number},
        speechiness: {
          type: Number},
        popularity: {
          typr: Number}
});

const addTopMusicToDatabase = () => {
  topMusicData.forEach(topmusic => {
    new TopMusic(topmusic).save()
  });
};
addTopMusicToDatabase();


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Music makes people come togheter!')
})

// Using Async + Await
// app.get('/topmusics', async (req, res) => {
//   const topmusic = await TopMusic.find()
//   res.json(topmusic)
//   })

//Using promises
app.get('/topmusics', (req, res) => {
  TopMusic.find()
  .then((results) => {
    // console.log('Found: ' + results)
    res.json(results)
  }).catch((err) => {
    console.log('Error' + err)
    res.json({message: 'Cannot find music', err: err}) //How do can i test error here? Maybe I dont need it?
  })
})

app.get('/topmusics/id/:id', (req, res) => {
  const id = req.params.id
  TopMusic.findOne({'id': id})
  .then((results) => {
    // console.log('Found: ' + results)
    res.json(results)
  }).catch((err) => {
    console.log('Error' + err)
    res.json({message: 'Cannot find this song', err: err})
  })
})






// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

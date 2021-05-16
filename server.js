import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const MusicSchema = new mongoose.Schema({
  "id": Number,
  "trackName": String,
  "artistName": String,
  "genre": String,
  "bpm": Number,
  "energy": Number,
  "danceability": Number,
  "loudness": Number,
  "liveness": Number,
  "valence": Number,
  "length": Number,
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
});

const Music = mongoose.model('Music', MusicSchema);


if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Music.deleteMany()
    await topMusicData.forEach(song => {
      const newMusic = new Music(song);
      newMusic.save();
    })
  }
  seedDB();
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
  res.send('Hello, welcome to Top Music backend')
})

app.get('/tracks', async (req, res) => {
  const tracks = await Music.find();
  res.json(tracks)
})

app.get('/tracks/:trackId', async (req, res) => {
  const { trackId } = req.params;
  const oneTrack = await Music.findOne({ _id: trackId })
  res.json(oneTrack)
})

// app.get('/avocados', (request, response) => {
//   const { region } = request.query
//   if( region ) {
//     const regionList = avocadoSalesData.filter(avocado => avocado.region.includes(region))
//     response.json(regionList)
//   }
//   response.json(avocadoSalesData)
// })

// app.get('/avocados/:id', (request, response) => {
//   const { id } = request.params
//   const avocado = avocadoSalesData.find(avocado => avocado.id === +id)
//   if (avocado) {
//     response.json(avocado)
//     } 
//     response.status(404).send(`The requested resource could not be found`)
// })



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

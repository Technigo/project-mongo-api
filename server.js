import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import artistData from './data/artistsCSV.json'


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Artist = mongoose.model('Artist', {
  id: Number,
  name: String,
  nationality: String

})
const ArtistDetail = mongoose.model('ArtisDetail', {
 id: Number,
 name: String,
 years: String,
 genre: String,
 nationality: String,
 bio: String,
 wikipedia: String,
 paintings: Number
})

// RESET_DB=true
if (process.env.RESET_DB){
  const seedDatabase = async () => {
    await Artist.deleteMany()
    await ArtistDetail.deleteMany()

    artistData.forEach((artist) => {
			new ArtistDetail(artist).save()
		})

    artistData.forEach((artist)=>{
      new Artist( {
        id: artist.id,
        name: artist.name,
        nationality: artist.nationality
      }).save()
    })

  }
  

  seedDatabase()
}


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
app.use('/images', express.static('./artistImages'))

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/artists', async (req, res)=>{
  const artists = await Artist.find()
  res.json(artists)
})

app.get('/artists/id/:id', async (req, res)=>{
  const id = req.params.id
  const artistId = await ArtistDetail.findOne ({ id })
  if (artistId) {
    res.json(artistId)
  }
  res.status(404).json({error:"artist not found"})
})
app.get('/artists/name/:name', async (req, res)=>{
  const name = req.params.name
  const artistId = await ArtistDetail.findOne ({ name })
  if (artistId) {
    res.json(artistId)
  }
  res.status(404).json({error:"artist not found"})
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

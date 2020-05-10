import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import artistData from './data/artistsCSV.json'
import {Artist, ArtistDetail} from './models'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/artists"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// RESET_DB=true
if (process.env.RESET_DB){
  const seedDatabase = async () => {
    await ArtistDetail.deleteMany()

    artistData.forEach((artist) => {
			new ArtistDetail(artist).save()
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

app.use((req, res, next)=>{
  if (mongoose.connection.readyState === 1){
    next()
  }
  else {
    res.status(503).json({error:"service unavailible"})
  }
})
// Start defining your routes here
app.get('/', (req, res) => {
  res.send('project artists')
})

app.get('/artists', async (req, res)=>{
  const artists = await ArtistDetail.find({},{id: 1, name: 1, nationality: 1})
  const {nat} = req.query
  let filteredArtist = artists.filter((item)=>item.nationality===nat)
  if(nat) {
    if (filteredArtist.length){
    res.json(filteredArtist)
    }
    else{
      res.status(404).json({error:"Artists not found"})
    }
  }
  else{
    res.json(artists)
  }
  
})

app.get('/artists/id/:id', async (req, res)=>{
  try {
    const id = req.params.id
    const artistId = await ArtistDetail.findOne ({ id })
    if (artistId) {
      res.json(artistId)
    }
    res.status(404).json({error:"artist not found"})
  }
  catch{
    res.status(400).json({error:"invalid user ID"})
  }
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

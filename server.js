import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())


// when searching for artists- all artists-
const Artist = mongoose.model('Artist', {
  name: String,
  track: String,
  energy: Number, 
  danceAbility: Number
})

//being able to search for one artist
//being able to search for one track


// search based on genre? 
const Genre = mongoose.model('Genre', {
  name: String,
  artist: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist '
  }
})
  
//able to search for songs based on 'danceability' - up-tempo or slow!  


app.get('/', (req, res) => {
  res.send('Hello surdeg!')
})



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

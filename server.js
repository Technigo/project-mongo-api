import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json' 

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Director = mongoose.model('Director', {
  name:String
})

const Show = mongoose.model('Show', {
  show_id: Number,
  title: String,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  release_year: String,
  country: String,
  type: String,
})

if (process.env.RESET_DATABASE) {
    console.log('Resetting database!');
  const seedDatabase = async () => {
  
    await Show.deleteMany();
    await Director.deleteMany();
   
    netflixData.forEach(item => {
        const newShow = new Show(item);
        newShow.save();
      })
    }
    seedDatabase();
  }

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service Unavailable' })
  }
})

app.get('/', (req, res) => {
  res.send('Hello current endpoints: /shows || shows/id || shows/director/objectid')
})

app.get('/shows', async (req, res) =>  {
  try {
    const allShows = await Show.find();
    if(allShows) {
      res.json(allShows)
    } else {
      res.status(404).json({ error: 'Data not found' })
    } 
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' })
  }
  })

app.get('/shows/:id', async (req, res) => {
    try {
    const showId = await Show.findOne({ show_id: req.params.id })
    if(showId) {
      res.json(showId)
    } else {
      res.status(404).json({ error: 'Show not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid show id' })
  }
  })

  app.get('/shows/director/:director', (req, res) => {
    Show.find(req.params, (err, data) => {
      res.json(data)
    })
  })

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
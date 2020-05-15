import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'
import NetflixShow from './models/show'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

if (process.env.RESET_DB) {
  console.log('Resetting Database!')
  const seedDatabase = async () => {
    await NetflixShow.deleteMany({})
    netflixData.forEach((show) => {
      new NetflixShow(show).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

app.get('/', (req, res) => {
  res.send(`<p>Netflix show data with endpoints: <br> /netflixshows<br> /netflixshows?query="Your Query"<br> /netflixshows/type?type="Movie/TV Show"<br> /netflixshows/rating?rating="TV-Y/TV-Y7/TV-Y7-FV/TV-G/G/TV-PG/PG/PG-13/TV-14/TV-MA/R"<br> /netflixshows/title/"Your Title"<p>`)
})

app.get('/netflixshows', async (req, res) => {
  const { query } = req.query
  const queryRegEx = new RegExp(query, 'i') 
  const netflixShows = await NetflixShow.find({ title: queryRegEx }).sort({title: 1})
  res.json(netflixShows)
})
 
app.get('/netflixshows/type', async (req, res) => {
  const { type } = req.query
  let shows = await NetflixShow.find()
  if (type) { 
    shows = shows.filter((show) => show.type.toString() === type)
  }
  if (shows.length === 0) {
    res.status(404).send('Please select Movie or TV Show to filter on "type"')
  }
  res.json(shows)
})

app.get('/netflixshows/rating', async (req, res) => {
  const { rating } = req.query
  let shows = await NetflixShow.find()
  if (rating) {
    shows = shows.filter((show) => show.rating.toString() === rating)
  }
  if (shows.length === 0) {
    res.status(404).send('Available ratings: TV-Y, TV-Y7, TV-Y7-FV, TV-G, G, TV-PG, PG,  PG-13, TV-14, TV-MA and R')
  }
  res.json(shows) 
})

app.get('/netflixshows/title/:title', async (req, res) => {
  const { title } = req.params
  const show = await NetflixShow.findOne({ title })
  if (show) {
    res.json(show)
  } else {
    res.status(404).json({ error: `Could not find ${title}` })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const NetflixShow = mongoose.model('NetflixShow', {
  show_id: { type: Number },
  title: { type: String },
  director: { type: String },
  cast: { type: String },
  country: { type: String },
  date_added: { type: String },
  release_year: { type: Number },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  description: { type: String },
  type: { type: String },
})

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

app.get('/netflixshow', async (req, res) => {
  const netflixShows = await NetflixShow.find();
  res.json(netflixShows);
});
 
app.get('/netflixshow/type', async (req, res) => {
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

app.get('/netflixshow/rating', async (req, res) => {
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

app.get('/netflixshow/title/:title', async (req, res) => {
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
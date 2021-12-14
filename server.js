import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

// import booksData from './data/books.json'
import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/jakob-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  // res.send('Welcome to my first backend')
  res.send(listEndpoints(app))
})

// app.get('/endpoints', (req, res) => {
//   res.send(listEndpoints(app))
// })

app.get('/top', (req, res) => {
  res.json(topMusicData)
})
app.get('/top/:id', (req, res) => {
  const { id } = req.params

  const trackId = topMusicData.find((trackName) => trackName.id === +id)

  if (!trackId) {
    res.status(404).send('No artist found')
  } else {
    res.json(trackId)
  }
})

// Start the server89i
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port} go go go`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/NetflixItem"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const NetflixItem = mongoose.model('NetflixItem', {
  title: String,
  release_year: Number,
  country: String,
  show_id: Number,
  type: String
})
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await NetflixItem.deleteMany({})

		netflixData.forEach((item) => {
			new NetflixItem(item).save()
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
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1){
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})


app.get('/', (req, res) => {
  const myEndpoints = require('express-list-endpoints')
  // Displays the endpoints that are available 
  res.send(myEndpoints(app))
})

app.get('/netflixitems', (req, res) => {
  NetflixItem.find().then(movies => {
    res.json(movies)
  })
})

app.get('/releaseyear/:release_year', async (req, res) => {
  
   const item = await NetflixItem.findById(req.params.release_year)
      if (item) {
        res.json(item)
      } else {
        res.status(404).json({error: 'Release year not found'})
      }
    
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

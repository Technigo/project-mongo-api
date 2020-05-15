import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo-api'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) =>{
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

app.use(bodyParser.json())

// Model
const Nominee = mongoose.model('Nominee', {
  nominee: String,
  year_award: Number,
  year_film: Number,
  category: String,
  win: Boolean
})

if (process.env.RESET_DB) {
  console.log('reseting the database...')

  const seedDatabase = async () => {
    await Nominee.deleteMany()
    // Send all the json from data
    await goldenGlobesData.forEach((nominee) => {
      new Nominee(nominee).save()
    })
  }
  seedDatabase()
}


app.get('/', (req, res) => {
  Nominee.find().then(nominees => {
    res.send('Welcome to golden globe library')
    res.json(nominees)
  })
})

app.get('/nominees', async (req, res) => {
  const nominees = await Nominee.find()
  res.json(nominees)
})

app.get('/:nominee', (req, res) => {

  Nominee.findOne({ nominee: req.params.nominee }).then(nominee => {
    try {
      if (nominee) {
        res.json(nominee)
      } else {
        res.status(404).json(`error: Nominee ${nominee} not found`)
      }
    } catch (err) {
    res.status(400).json(`Bad Request: this error is an HTTP status code that means that the request you sent to the website server, often something simple like a request to load a web page, was somehow incorrect or corrupted and the server couldn't understand it.`)
    }
  })
}) 

/* All nominations for specific year it was nominated and if winner*/
app.get('/year/:year', (req, res) => { 
  const year = req.params.year 
  const winner = req.query.won 
  let fromYear = globeData.filter((item) => item.year_award === +year) 
  
  if (winner) { 
    fromYear = fromYear.filter((item) => item.win ) 
  } 
  res.json(fromYear) 
})

app.get('/winners', (_, res) => {

  let winners = globeData.filter(item => {
    return item.win === true
  })
  
  res.json(winners)

})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

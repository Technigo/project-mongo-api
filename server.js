import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json' 
//connecting to mongodb
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
//connecting database to mongoose
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
  //first clean database and then populate
  const seedDatabase = async () => {
    //do not proceeed until deleteMany ie db cleaned
    await Show.deleteMany();
    // await Director.deleteMany();
   
    netflixData.forEach(item => {
        //whatever specified in Schema, single object from json array
        const newShow = new Show(item);
        newShow.save();
      })
    }
    seedDatabase();
  }

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//error handling disconnected server
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service Unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})


//whole array of netflixdata
app.get('/shows', async (req, res) =>  {
  // res.json(netflixData);
  try {
    const allShows = await Show.find();
    //can not be excuted until show.find is executed
    if(allShows) {
      res.json(allShows)
    } else {
      res.status(404).json({ error: 'Data not found' })
    } 
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' })
  }
  })

  
//single show based on json.show-id // http://localhost:8080/shows/81132444
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

  //returns show(s) by director db objectId / http://localhost:8080/shows/director/53636f7474204d6341626f79
  app.get('/shows/director/:director', (req, res) => {
    Show.find(req.params, (err, data) => {
      res.json(data)
    })
  })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

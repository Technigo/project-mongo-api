import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//API input
import netflixTitles from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Netflixdata = mongoose.model('Netflixdata', {

  show_id: {
    type: Number
  },
  title: {
    type: String
  }, 
  director: {
    type: String
  },
  cast:  {
    type: String
  },
  country: {
    type: String
  },
  date_added: {
    type: String
  },
  release_year: {
    type: Number
  },
  rating: {
    type: String
  },
  duration: {
    type: String
  },
  listed_in: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String
  }


})

if (process.env.RESET_DATABASE) {
  console.log("Resetting database...");
  const seedDatabase = async () => {
    await Netflixdata.deleteMany();
    
    netflixTitles.forEach((netflixdata) => new Netflixdata(netflixdata).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello! use these routes /nominees')
})


app.get("/nominees", async (req, res) => {
  const titles = await Netflixdata.find();
  res.json(titles);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})




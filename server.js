import dotenv from 'dotenv'

import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true
  },
  country: {
    type: String,
    lowercase: true
  },
  director: { 
    type: String,
    lowercase: true
  },
  release_year: Number,
  type: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    lowercase: true
  }
})

const Show = mongoose.model('Show', showSchema);


//TO USE THIS, TYPE: RESET_DB=true npm run dev IN TERMINAL

if (process.env.RESET_DB) {
const seedDB = async () => {
  await Show.deleteMany();

  netflixData.forEach(item => {
    const newShow = new Show(item)
    newShow.save();
  });
}
seedDB();
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors()) 
app.use(express.json())

app.get('/', (req, res) => {
  Show.find().then(show => {
    res.json('Show most go on!')
  })
})

// All descriptions /shows/descriptions

app.get('/shows/descriptions', async (req, res) => {
  const allDescriptions =  await Show.find()
  .then((items) => items.map(item => item.description))
  res.json({  data: allDescriptions })
});

//http://localhost:8082/shows

app.get('/shows', async (req, res) => {
  const show = await Show.find();
  res.json(show)
});

//http://localhost:8082/shows/series
app.get('/shows/series', async (req, res) =>{
  const data = await Show.find({ type: 'TV Show'})
  res.json(data)
});

// //return one show by id

app.get('/shows/:showid', async (req, res) =>{
  const { showid } = req.params;

  try {
    const singleShow = await Show.findById({_id: showid});
    res.json(singleShow);
  } catch(error) {
    res.status(400).json({error: 'sorry', details: error });
  }
});

//return one show by title. Use this way to write async/await code with the catch error

app.get('/shows/show/:showname', async (req, res) =>{
  const { showname } = req.params;

    try {
      const singleShow = await Show.findOne({ title: showname });
      res.json(singleShow);
    } catch(error) {
      res.status(400).json({error: 'Invalid request', details: error }); 
    }
})

//http://localhost:8082/shows/directors?director=Mati%20Diop
// //quary params when its only one, unique. ($reqex: new RegExp(showTitle, 'i' dont care about case sensitive)

app.get('/shows/directors/', async (req, res) => {
  const { director } = req.query;

  if (director) {
    const shows = await Show.find({ 
      director:{
        $regex: new RegExp(director, 'i')
      } 
    })
    res.json(shows);
  } else {
    const shows = await Show.find();
    res.json(shows);
  }
})

//http://localhost:8082/showlist?releaseYear=2018

app.get('/showlist', async (req, res) => {
  let data
  const { releaseYear } = req.query;
  const { country } = req.query;

  if (releaseYear) {
    data = await Show.find({release_year: +releaseYear })
  } else if (country) {
    data = await Show.find({
        country: {
        $regex: new RegExp(country, "i")
      }
    })
  } else {
    data = await Show.find()
  }
  res.json(data)
})

//http://localhost:8082/shows/countries?country=india

app.get('/shows/countries', async (req, res) => {
  const { country } = req.query;

  if (country) {
    const shows = await Show.find({
      country: {
        $regex: new RegExp(country, "i")
      }
    })
    res.json(shows);
  } else {
    const shows = await Show.find();
    res.json(shows);
  }
})

app.listen(port, () => {

  console.log(`Server running on http://localhost:${port}`)
})

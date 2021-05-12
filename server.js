import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
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
  duration: {
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

//   PORT=9000 npm start
const port = process.env.PORT || 8082
const app = express()

// Add middlewares to enable cors
app.use(cors()) 
app.use(express.json())


// Start defining your routes here
app.get('/', (req, res) => {
  Show.find().then(show => {
    res.json('Show most go on!')
  })
})

// app.get('/list/descriptions', async (req, res) => {
//   const allDescriptions = await Show.map(item => item.description);

//   res.json({ data:allDescriptions })
// });

//http://localhost:8082/list

app.get('/list', async (req, res) => {
  const show = await Show.find();
  res.json(show)
});

app.get('/list/series', async (req, res) =>{
  const data = await Show.find({ type: 'TV Show'})
  res.json(data)
});

// //return one show by id
app.get('/list/:showid', async (req, res) =>{
  const { showid } = req.params;

  const singleShow = await Show.findById({_id: showid});
  res.json(singleShow);
});

// //return one show by title. Use this way to write async/await code with the catch error
app.get('/list/show/:showname', async (req, res) =>{
  const { showname } = req.params;

    try {
      const singleShow = await Show.findOne({ title: showname });
      res.json(singleShow);
    } catch(error) {
      res.status(400).json({error: 'sorry', details: error }); 
    }
})

//http://localhost:8082/list/directors?director=Mati%20Diop
// //quary params when its only one, unique. ($reqex: new RegExp(showTitle, 'i' dont care about case sensitive)
app.get('/list/directors/', async (req, res) => {
  const { director } = req.query;

  if (director) {
    const list = await Show.find({ 
      director:{
        $regex: new RegExp(director, 'i')
      } 
    })
    res.json(list);
  } else {
    const list = await Show.find();
    res.json(list);
  }
})



//http://localhost:8082/list/countries?country=india

app.get('/list/countries', async (req, res) => {
  const { country } = req.query;

  if (country) {
    const list = await Show.find({
      country: {
        $regex: new RegExp(country, "i")
      }
    })
    res.json(list);
  } else {
    const list = await Show.find();
    res.json(list);
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:8082`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

//Connecting to mongodb database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/NetflixItem"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Creating model of each instance that will be stored in database.
const NetflixItem = mongoose.model('NetflixItem', {
  title: String,
  release_year: Number,
  country: String,
  show_id: Number,
  type: String
})

//Seeding database and removing old items
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await NetflixItem.deleteMany({})

		netflixData.forEach((item) => {
			new NetflixItem(item).save()
		})
  }
  seedDatabase()
}

// Defines the port the app will run on. 
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Handels 503 error e.g if database is unavilable
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1){
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

//Displays first page 
app.get('/', (req, res) => {
  res.json('Welcome to Marjaanas Netflix API 🍿🍿🍿🍿  For documentation go to https://technigo-mongo-api.herokuapp.com/documentation');
})

// First endpoint that will return the whole array of netflix items. 
app.get('/netflixitems', async (req, res) => { 
  const allItems = await NetflixItem.find()
    res.json(allItems)
})

// Second endpoint where user can search for a specific Netflix item plus a release year and a list of Netflix items are returned.
app.get('/netflixitems/releaseyear/:release_year', async (req, res) => {
  try {
   const netflixItem = await NetflixItem.find({release_year: req.params.release_year})
      if (netflixItem) {
        res.json(netflixItem)
      } 
    } catch (err) {
      // error when the release year format is wrong, an invalid release year is entered
      res.status(400).json({ error: 'Invalid release year entered' });
    }
})

// Third endpoint where the user can search for a specific Netflix item ID and a specific Netflix item will be returned.
app.get('/netflixitems/:id', async (request, response) => {
  const specificItem = await NetflixItem.findOne({show_id: request.params.id});

  if(specificItem) {
    response.json(specificItem);
  } else {
    response.status(404).json({ error: "Could not find Netflix item with that id"}); 
  }  
})

// Fourth endpoint where the user can get Netflix items by a specific title
app.get('/netflixitems/title/:title', async (req, res) => {
  const paramTitle = req.params.title;
  // Added a regex so that it will search non-case-sensitive and if the title is included
  // in the title string
  const itemTitle = await NetflixItem.find({ title: { $regex : new RegExp(paramTitle, "i") } });

  if (itemTitle.length === 0) {
    res.status(404).json({error: 'Could not find Netflix item with that title'})
  }else{
    res.json(itemTitle);
  }
});

// Created an object for the documentation. Can be found on the start page of the api url
const documentation = {
  'Endpoint 1': {
    'https://technigo-mongo-api.herokuapp.com/netflixitems': 'Returns the entire Netflix array'
  },

  'Endpoint 2': {
    'https://technigo-mongo-api.herokuapp.com/netflixitems/releaseyear/:release_year': 'Use this endpoint to return Netflix items with a specific release year and replace :release_year with a number.'
  },
  
  'Endpoint 3': {
    'https://technigo-mongo-api.herokuapp.com/netflixitems/:id': 'Use this endpoint to return Netflix items with a specific id and replace :id with a number.'
  },

  'Endpoint 4': {
    'https://technigo-mongo-api.herokuapp.com/netflixitems/title/:title': 'Use this endpoint to return Netflix items with a specific title and replace title with a string.'
  },
};

//Path for my api documentation to be found which is the homepage of the url
app.get('/documentation', (request, response) => {
  response.json(documentation);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

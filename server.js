import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import michelinData from './data/michelin-restaurants.json'
import Michelin from './model/michelin'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
      await Michelin.deleteMany();
      console.log(`Deleting databse`)
      await michelinData.forEach((restaurant) => new Michelin(restaurant).save());
      console.log(`Building new database`)
  };
  seedDatabase();
}

app.get('/', (req, res) => {
  res.send(`
  <h1>2-star Michelin restaurants</h1>
  <h3>This dataset contains restaurants all over the  world</h3>
  <br>
  <h2>Endpoints and querys</h2>
  <li>/michelin</li>
  <li>/michelin/regions</li>
  <li>/michelin/regions?region=YOUR_COUNTRY</li>
  <li>/michelin/cuisines</li>
  <li>/michelin/cuisines?cuisine=YOUR_CUISINE</li>
  <li>/michelin/citys</li>
  <li>/michelin/citys?city=YOUR_CITY</li>
  <li>/michelin/:name</li>
  <li>/michelin/year/:year</li>
  `)
})

// List all restaurants
app.get('/michelin', async (req, res) => {
  const restaurant = await Michelin.find();

  if ( restaurant.length > 0  ) {
    res.json(restaurant)
  } else {
    res.status(404).json({ message: `Error, no restaurants found.` })
  }
});

// List all regions with /michelin/regions
// Query region with /michelin/regions?region=sweden
app.get('/michelin/regions/', async ( req, res ) => {
  const { region } = req.query

  let restaurantByRegion = await Michelin.find({ region })
  let allUniqueRegions = await Michelin.find({}).distinct('region')

  if ( restaurantByRegion.length > 0 ) {
    res.json({ totalResults: restaurantByRegion.length, restaurantByRegion })
  } else if ( region && restaurantByRegion.length === 0 ) {
    res.status(404).json({ message: `Error, ${region} not found` })
  }
  res.json({ totalResults: allUniqueRegions.length, allUniqueRegions })
})

// List all cuisines with /michelin/cuisines
// Query cuisine with /michelin/cuisines?cuisine=creative
app.get('/michelin/cuisines/', async ( req, res ) => {
  const { cuisine } = req.query

  let restaurantByCuisine = await Michelin.find({ cuisine })
  let allUniqueCuisines = await Michelin.find({}).distinct('cuisine')

  if ( restaurantByCuisine.length > 0 ) {
    res.json({ totalResults: restaurantByCuisine.length , restaurantByCuisine })
  } else if ( cuisine && restaurantByCuisine.length === 0 ) {
    res.status(404).json({ message: `Error, ${cuisine} not found` })
  }
  res.json({ totalResults: allUniqueCuisines.length, allUniqueCuisines })
})

// List all citys with /michelin/citys
// Query city with /michelin/citys?city=stockholm
app.get('/michelin/citys/', async ( req, res ) => {
  const { city } = req.query

  let restaurantByCity = await Michelin.find({ city })
  let allUniqueCitys = await Michelin.find({}).distinct('city')

  if ( restaurantByCity.length > 0 ) {
    res.json({ totalResults: restaurantByCity.length , restaurantByCity })
  } else if ( city && restaurantByCity.length === 0 ) {
    res.status(404).json({ message: `Error, no restaurants found in ${city}` })
  }
  res.json({ totalResults: allUniqueCitys.length, allUniqueCitys })
})

// Find restaurant by name
// Use parameter with /michelin/pierre
app.get('/michelin/:name', async ( req, res ) => {
  const { name } = req.params
  const restaurantByName = await Michelin.findOne({ name: name })
  if ( restaurantByName ) {
    res.json( restaurantByName )
  } else {
    res.status(404).json({ message: `Error, no restaurant by that name` })
  }
})

// Find restaurants by year
// Use parameter with /michelin/2019
app.get('/michelin/year/:year', async ( req, res ) => {
  const { year } = req.params
  const restaurantByYear = await Michelin.find({ year: year })

  if ( restaurantByYear.length > 0 ) {
    res.json({ totalResults: restaurantByYear.length, restaurantByYear})
  } else {
    res.status(404).json({ message: `Error, no restaurants by that year` })
  }
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

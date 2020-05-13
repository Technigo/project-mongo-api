import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'
import itemData from './data/item-history.json'
import michelinData from './data/michelin-restaurants.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

// This can be exported to external file instead
const Michelin = mongoose.model('Michelin',{
  name: String,
  year: Number,
  latitude: Number,
  longitude: Number,
  city: String,
  region: String,
  zipCode: String,
  cuisine: String,
  price: String,
  url: String,
})


//   MICHELIN-RESTAURANTS
// name: String,
// year: Number,
// latitude: Number,
// longitude: Number,
// city: String,
// region: String,
// zipCode: String,
// cuisine: String,
// price: String,
// url: String,


if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
      await Michelin.deleteMany();
      await michelinData.forEach((restaurant) => new Michelin(restaurant).save());
  };
  seedDatabase();
}


const onlyUnique = (value, index, self) => { 
  return self.indexOf(value) === index;
}

app.get('/', (req, res) => {
  res.send(`
  <h1>2-star Michelin restaurants</h1>
  <h3>This dataset contains restaurants all over the  world</h3>
  <br>
  <h2>Endpoints and querys</h2>
  <li>/michelin</li>
  <li>/michelin/regions</li>
  <li>/michelin/regions?region=YOUR_COUNRY</li>
  <li>/michelin/cuisines</li>
  <li>/michelin/cuisines?cuisine=YOUR_CUISINE</li>
  <li>/michelin/citys</li>
  <li>/michelin/citys?city=YOUR_CITY</li>
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

  let restaurantByRegion = await michelinData.filter((restaurant) => restaurant.region.toLowerCase() === region)
  let getAllRegionsArr = await michelinData.map(restaurant => restaurant['region'])

  let uniqueRegions = await getAllRegionsArr.filter( onlyUnique )

  if ( restaurantByRegion.length > 0 ) {
    res.json({ totalResults: restaurantByRegion.length, restaurantByRegion})
  } else if ( region && restaurantByRegion.length === 0 ) {
    res.status(404).json({ message: `Error, ${region} not found` })
  }
  res.json({ totalResults: uniqueRegions.length, uniqueRegions})
})

// List all cuisines with /michelin/cuisines
// Query cuisine with /michelin/cuisines?cuisine=creative
app.get('/michelin/cuisines/', async ( req, res ) => {
  const { cuisine } = req.query

  let restaurantByCuisine = await michelinData.filter((restaurant) => restaurant.cuisine.toLowerCase() === cuisine )
  let getAllCusinesArr = await michelinData.map(restaurant => restaurant['cuisine'])

  let uniqueCusines = await getAllCusinesArr.filter( onlyUnique )

  if ( restaurantByCuisine.length > 0 ) {
    res.json({ totalResults: restaurantByCuisine.length , restaurantByCuisine})
  } else if ( cuisine && restaurantByCuisine.length === 0 ) {
    res.status(404).json({ message: `Error, ${cuisine} not found` })
  }
  res.json({ totalResults: uniqueCusines.length, uniqueCusines})
})

// List all citys with /michelin/citys
// Query city with /michelin/citys?city=stockholm
app.get('/michelin/citys/', async ( req, res ) => {
  const { city } = req.query

  let restaurantByCity = await michelinData.filter((restaurant) => restaurant.city.toLowerCase() === city )
  let getAllCitysArr = await michelinData.map(restaurant => restaurant['city'])

  let uniqueCitys = await getAllCitysArr.filter( onlyUnique )

  if ( restaurantByCity.length > 0 ) {
    res.json({ totalResults: restaurantByCity.length , restaurantByCity})
  } else if ( city && restaurantByCity.length === 0 ) {
    res.status(404).json({ message: `Error, no restaurants found in ${city}` })
  }
  res.json({ totalResults: uniqueCitys.length, uniqueCitys})
  
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

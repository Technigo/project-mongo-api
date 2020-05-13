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

// This can be exported to externa file instead
const Michelin = mongoose.model('Michelin',{
  name: String,
  year: Number,
  latitude: Number,
  longitude: Number,
  city: String,
  region: String,
  zipCode: Number,
  cuisine: String,
  price: String,
  url: String,
})


//    BOOKS.JSON
// bookID: Number,
// title: String,
// authors: String,
// average_rating: Number,
// isbn: Number,
// isbn13: Number,
// language_code: String,
// num_pages: Number,
// ratings_count: Number,
// text_reviews_count: Number,


//   ITEM-HISTORY.JSON
// average: Number,
// date: String,
// highest: Number,
// lowest: Number,
// order_count: Number,
// volume: Number,


//   MICHELIN-RESTAURANTS
// name: String,
// year: Number,
// latitude: Number,
// longitude: Number,
// city: String,
// region: String,
// zipCode: Number,
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


app.get('/', (req, res) => {
  res.send('Hello world')
})

// Show all 50 restaurants
app.get('/michelin', async (req, res) => {
  const restaurant = await Michelin.find();
  console.log(`Found ${restaurant.length} items..`);
  res.json(restaurant);
});

// Region, filter by country michelin/:region
app.get('/michelin/:region', ( req, res ) => {
  const region = req.params.region

  let michelinByRegion = michelinData.filter((restaurant) => restaurant.region === region)
  console.log(`Number of restaurants found: ${michelinByRegion.length}`)
  
  if ( michelinByRegion.length > 0 ){
    res.json(michelinByRegion)
  } else {
    res.status(404).json({ message: `Error, no restaurants found in ${region}` })
  }
})


// Store all cuisines in a list an show results michelin/cuisine
// Laster filter by cuisine michelin/cuisine?cuisine=modern

// Filter on price michelin/price?price=$

// Filter by year michelin/:year

// Create a put method and delete method?

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import { Dessert } from './data/dessert'
import { Menu } from './data/menu'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import netflixData from './data/netflix-titles.json'
// import booksData from './data/books.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


if (process.env.RESET_DATABASE) {
  console.log('Resetting the database!')
  const seedDatabase = async () => {
    await Dessert.deleteMany()

    // Save dessrts
    const buns = new Dessert({
      name: 'Cinnamon Buns',
      typeOf: 'All-Time Favorite',
      ingredients: 10,
      img_url: 'http://tiny.cc/ql7ooz',
      time: 240,
    })
    await buns.save()

    const rhubarb = new Dessert({
      name: 'Rhubarb Pie',
      typeOf: 'Fresh and easy',
      ingredients: 6,
      img_url: 'http://tiny.cc/sk7ooz',
      time: 30,
    })
    await rhubarb.save()

    const mums = new Dessert({
      name: 'Love Mums',
      typeOf: 'Chocolate in pan',
      ingredients: 12,
      img_url: 'http://tiny.cc/4j7ooz',
      time: 30,
    })
    await mums.save()

    const blueberry = new Dessert({
      name: 'Blueberry Cheesecake',
      typeOf: 'New York Classic',
      ingredients: 8,
      img_url: 'http://tiny.cc/0y1poz',
      time: 60,
    })
    await blueberry.save()


    // Save food menu
    await Menu.deleteMany()

    const pomodoro = new Menu({
      name: 'Pasta Pomodoro',
      typeOf: 'Simple Italian Classic',
      ingredients: 5,
      img_url: 'http://tiny.cc/fg7ooz',
      time: 15,
    })
    await pomodoro.save()

    const tacos = new Menu({
      name: 'Mexican Tacos',
      typeOf: 'South American Favorite',
      ingredients: 12,
      img_url: 'http://tiny.cc/lh7ooz',
      time: 40,
    })
    await tacos.save()

    const meatballs = new Menu({
      name: 'Swedish Meatballs',
      typeOf: 'The Timeless Original',
      ingredients: 5,
      img_url: 'http://tiny.cc/zi7ooz',
      time: 30,
    })
    await meatballs.save()

    const masala = new Menu({
      name: 'Tikka Masala',
      typeOf: 'Indian Spices',
      ingredients: 7,
      img_url: 'http://tiny.cc/371poz',
      time: 20,
    })
    await masala.save()
  }
  seedDatabase()
}


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world, next backend project!')

})

// Show all desserts
app.get('/dessert', async (req, res) => {
  const dessert = await Dessert.find()
  res.json(dessert)
})

// Show all foods
app.get('/food', async (req, res) => {
  const food = await Menu.find()
  res.json(food)
})

// View specific dessert
app.get('/dessert/:id', async (req, res) => {
  const menuItem = await Dessert.findById(req.params.id)

  if (menuItem) {
    res.json(menuItem)
  } else {
    res.status(404).json({ error: 'Nope, nothing here!' })
  }
})

app.get('/food/:id', async (req, res) => {
  const foodItem = await Menu.findById(req.params.id)

  if (foodItem) {
    res.json(foodItem)
  } else {
    res.status(404).json({ error: 'Nothing to see here...'})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

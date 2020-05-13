import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { Dessert } from './data/dessert'
import { Menu } from './data/menu'


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


if (process.env.RESET_DATABASE === 'true') {
  console.log('Resetting the database!')
  const seedDatabase = async () => {
    await Dessert.deleteMany()
    await Menu.deleteMany()

    // Save dessrts
    const buns = new Dessert({
      name: 'Cinnamon Buns',
      typeOf: 'All-Time Favorite',
      ingredients: 10,
      img_url: 'http://tiny.cc/ql7ooz',
      time: 240,
      recipe: 'https://www.scandikitchen.co.uk/how-to-make-the-best-ever-real-scandi-cinnamon-buns/',
    })
    await buns.save()

    const rhubarb = new Dessert({
      name: 'Rhubarb Pie',
      typeOf: 'Fresh and easy',
      ingredients: 6,
      img_url: 'http://tiny.cc/sk7ooz',
      time: 30,
      recipe: 'https://cooking.nytimes.com/recipes/9420-straight-up-rhubarb-pie',
    })
    await rhubarb.save()

    const mums = new Dessert({
      name: 'Love Mums',
      typeOf: 'Chocolate in pan',
      ingredients: 12,
      img_url: 'http://tiny.cc/4j7ooz',
      time: 30,
      recipe: 'https://dailyinakitchen.com/2016/01/31/love-mums-karleksmums/',
    })
    await mums.save()

    const blueberry = new Dessert({
      name: 'Blueberry Cheesecake',
      typeOf: 'New York Classic',
      ingredients: 8,
      img_url: 'http://tiny.cc/0y1poz',
      time: 60,
      recipe: 'https://www.epicurious.com/recipes/food/views/blueberry-cheesecake-4302',
    })
    await blueberry.save()

    const pomodoro = new Menu({
      name: 'Pasta Pomodoro',
      typeOf: 'Simple Italian Classic',
      ingredients: 5,
      img_url: 'http://tiny.cc/mfovoz',
      time: 15,
      recipe: 'https://www.bonappetit.com/recipe/pasta-al-pomodoro',
    })
    await pomodoro.save()

    const tacos = new Menu({
      name: 'Mexican Tacos',
      typeOf: 'South American Favorite',
      ingredients: 12,
      img_url: 'http://tiny.cc/lh7ooz',
      time: 40,
      recipe: 'https://www.foodandwine.com/comfort-food/best-taco-recipes',
    })
    await tacos.save()

    const meatballs = new Menu({
      name: 'Swedish Meatballs',
      typeOf: 'The Timeless Original',
      ingredients: 5,
      img_url: 'http://tiny.cc/zi7ooz',
      time: 30,
      recipe: 'https://therecipecritic.com/the-best-swedish-meatballs/',
    })
    await meatballs.save()

    const masala = new Menu({
      name: 'Tikka Masala',
      typeOf: 'Indian Spices',
      ingredients: 7,
      img_url: 'http://tiny.cc/0govoz',
      time: 20,
      recipe: 'https://cafedelites.com/chicken-tikka-masala/',
    })
    await masala.save()
  }
  seedDatabase()
}


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Documentation: \n \n /food - List of food \n /food/:id - View specific food item \n \n /dessert - List of desserts \n /dessert/:id - View specific dessert item')

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
    res.status(404).json({ error: 'Nothing to see here...' })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


app.get('/shows/year/:release_year', async (req, res) => {
  const { release_year } = req.params
  const year = await Show.findOne({ release_year: release_year })

  if (year) {
    res.json(year)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})
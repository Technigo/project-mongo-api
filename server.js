import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { mongo } from 'mongoose'
import potterData from './data/potterData.json'

//The name of the database - mongodb://localhost/mongo-project-potter
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongo-project-potter"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//HOUSE MODEL
const House = mongoose.model('House', {
  name: String,
  mascot: String,
  head_teacher: String,
  ghost: String,
  founder: String
})

// const Book = mongoose.model('Book', {
//   title: String,
//   house: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'House'
//   }
// })

//POTTER CHARACTER MODEL
const Character = mongoose.model('Character', {
  id: Number,
  name: String,
  gender: String,
  job: String,
  house: String,
  wand: String,
  patronus: String,
  species: String,
  blood_status: String,
  hair_colour: String,
  eye_colour: String,
  loyalty: String,
  skills: String,
  birth: String,
  death: String
})

//Wrap the seed in an enviorment variable to prevent it from re-run everytime we start the server. RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  console.log('Resetting database!')
  const seedDatabase = async () => {
    await Character.deleteMany()
    await House.deleteMany()
    // await Book.deleteMany()

    const gryffindor = new House({ name: "Gryffindor", mascot: "Lion", head_teacher: "Minverva McGonogall", ghost: "Nearly Headless Nick", founder: "Godric Gryffindor" })
    await gryffindor.save()

    const slyterhin = new House({ name: "Slytherin", mascot: "Snake", head_teacher: "Severus Snape", ghost: "The Bloody Baron", founder: "Salazar Slytherin" })
    await slyterhin.save()

    const ravenclaw = new House({ name: "Ravenclaw", mascot: "Eagle", head_teacher: "Filius Flitwick", ghost: "The Grey Lady", founder: "Rowena Ravenclaw" })
    await ravenclaw.save()

    const hufflepuff = new House({ name: "Hufflepuff", mascot: "Badger", head_teacher: "Pomona Sprout", ghost: "the Far Friar", founder: "Helga Hufflepuff" })
    await hufflepuff.save()

    // await new Book({ title: "Harry Potter and the Philosopher's Stone", house: gryffindor }).save()
    // await new Book({ title: "Harry Potter and the Chamber of Secrets", house: slyterhin }).save()

    potterData.forEach((character) => {
      new Character(character).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//   PORT=9000 npm start
const port = process.env.PORT || 9090
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
//A function that recives a request, the response and the argument "next". 
//It will execute before the routes below, if it's not evoked next() it will block the code coming next. The connection.readyState checks that the connection is good.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// GET ROUTES
app.get('/', (req, res) => {
  res.send('Mongo-project: Harry Potter characters')
})

//GET ALL HOUSES. How do I combine the house model with the character model? 
app.get('/houses', async (req, res) => {
  const houses = await House.find()
  res.json(houses)
})

//Trying to get the house information populated into the character model but  can't make it to work. 
//Book is to test if it works with only "manually" created data and that worked... http://localhost:9090/books
// app.get('/books', async (req, res) => {
//   const books = await Book.find().populate('house')
//   res.json(books)
// })

//GET ALL CHARACTERS, Filter on name, house and job. http://localhost:9090/characters?name=harry&job=student&house=gryffindor&gender=male
app.get('/characters', (req, res) => {
  let queryObj = {}
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  };
  //Regular expression to make it case insensitive
  if (req.query.name) { queryObj['name'] = new RegExp(req.query.name, 'i') }
  if (req.query.house) { queryObj['house'] = new RegExp(req.query.house, 'i') }
  if (req.query.job) { queryObj['job'] = new RegExp(req.query.job, 'i') }
  if (req.query.gender) { queryObj['gender'] = new RegExp(req.query.gender, 'i') }

  Character.find(queryObj)
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({ id: 1 })
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results);
      res.json(results);
    }).catch((err) => {
      // Error/Failure
      console.log('Error ' + err);
      res.json({ message: 'Cannot find this character', err: err }); //Don't understand when this error message will show?
    });
});


//GET SPECIFIC CHARACTER  http://localhost:9090/characters/2
app.get("/characters/:id", async (req, res) => {
  const id = req.params.id
  const character = await Character.findOne({ "id": id })
  if (character) {
    res.json(character)
  } else {
    res.status(404).json({ error: "Character not found" })
  }
})
//GET SPECIFIC HOUSE
app.get("/houses/:id", async (req, res) => {
  const house = await House.findById(req.params.id)
  if (house) {
    res.json(house)
  } else {
    res.status(404).json({ error: "House not found" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
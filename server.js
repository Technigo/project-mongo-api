import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

import harryData from './data/harry-potter-characters.json'

const ERROR_CHARACTERS_NOT_FOUND = {error : 'No character results were found, please try again.'}

//creating the database 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/characters"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Character = mongoose.model('Character', {
  //  properties to match the keys from harryData.json
  id: Number,
  name: String,
  gender: String,
  job: String,
  house: String,
  wand: String,
  patronus: String,
  species: String,
  blood_status: String,
  hair_color: String,
  eye_color: String,
  loyalty: String,
  skills: String,
  birth_date: String,
  death_date: String
})

if (process.env.RESET_DATABASE) { // by using the if statement, database will only be reset when writing RESET_DATABASE=true npm run dev in console. 
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Character.deleteMany({}) //to prevent duplication when saving

    harryData.forEach((characterData) => {
      new Character(characterData).save()
    })
  }
  seedDatabase()
}

// const Author = mongoose.model('Author', {
//   name: String
// })

// const Book = mongoose.model('Book', {
//   title: String,
//   author: { // this will be related to the authors already in the database.
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Author'
//    }
// })

// if (process.env.RESET_DATABASE) { // by using the if statement, database will only be reset when writing RESET_DATABASE=true npm run dev in console. 
//   console.log('Resetting database!')

//   const seedDatabase = async () => {
//     await Author.deleteMany() // to prevent duplication when saving
//     await Book.deleteMany() // to prevent duplication when saving

//     const tolkien = new Author({ name: 'J.R.R Tolkien' })
//     await tolkien.save()
  
//     const rowling = new Author({ name: 'J.K Rowling' })
//     await rowling.save()

//     await new Book({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
//     await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
//     await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
//     await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
//     await new Book({ title: "The Hobbit", author: tolkien }).save()
//   }
//   //invoke function
//   seedDatabase()
// }

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/characters', async (req, res) => {
  const characters = await Character.find()
  res.json(characters)
})

app.get('/characters/:id', async (req, res) => {
  const id = await Character.findById(req.params.id)
  res.json(id)
  if (id) {
    res.json(id)
  } else {
    res.status(404).json({ error: 'Character not found' })
  }
})

// This endpoint shows one character from a unique id
app.get('/characters/id/:id', (request, response) => {
  const { id } = request.params
  const showId = harryData.find((item) => item.id === +id)
  // Include error response here
  if (!showId) {
    response.status(404).json(ERROR_CHARACTERS_NOT_FOUND)
  } else {
    response.json(showId)
  }
})

/*
app.get('/characters/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})
 */
/*
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author') // populate will create a relationship beween the author and books
  res.json(books)
})
*/

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import books from './data/mybooks.json'

//Setup to connect to our database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Fields of our model
const booksSchema = new mongoose.Schema ({
  bookID: Number,
  title: String,
  authors: String,
  num_pages: Number,
  language: String,
  sinopsis: String
})

//Model from booksSchema
const Book = mongoose.model('Book', booksSchema)

//Seeding of our database
if (process.env.RESET_DB) {
  console.log('SEEDING')
  const seedDB = async () => {
    await Book.deleteMany()

    await books.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }    
  seedDB()
}
  
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hola world')
})

//Reaching for all the books
app.get('/books', async (req, res) => {
  const books = await Ceremony.find();
  res.json(books)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

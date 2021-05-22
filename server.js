
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

dotenv.config()

import books from './data/mybooks.json'

//Setup to connect to our database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Fields of our model
const bookSchema = new mongoose.Schema ({
  bookID: Number,
  title: String,
  authors: String,
  num_pages: Number,
  language: String,
  sinopsis: String
})

//Model from booksSchema
const Book = mongoose.model('Book', bookSchema)

//Seeding of our database
if (process.env.RESET_DB) {
  
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
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hola world')
})

//Reaching for all the books
app.get('/books', async (req, res) => {
  const { title, authors } = req.query
 
  try { 
    const books = await Book.find({ 
      title: { 
        $regex: new RegExp(title || "", "i")
      }, 
      authors: {
        $regex: new RegExp(authors || "", "i")
      }
    })
    res.json(books)    
  }
  catch (error) {
        res.status(404).json({ error:'error'})
      }
})

//Reaching one single book
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId)
    res.json(singleBook)
  } catch(error) {
    res.status(404).json({ error: "Ooops! Something went wrong.", details: error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://tuttibalutti:pOSlRc4H7PATpf2n@cluster0.c3qao.mongodb.net/bookFinder?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Book collection
const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'  
  },
})

const Book = mongoose.model('Book', bookSchema)

//Author collection
const authorSchema = new mongoose.Schema({
  name: String
})

const Author = mongoose.model('Author', authorSchema)

//Seed the database
if (process.env.RESET_DB) { 
  const seedDB = async () => {
    await Book.deleteMany()
    await Author.deleteMany()

    let authorsNames = []

    booksData.forEach(book => {
      book.authors.split('-').forEach(author => {
        authorsNames.push(author)
      })
    })

    authorsNames = [...new Set(authorsNames)]

    let authorList = []

    authorsNames.forEach(async authorName => {
      const newAuthor = new Author({ name: authorName })
      authorList.push(newAuthor)
      await newAuthor.save()
    })

    booksData.forEach(async book => {
      const newBook = new Book({
        ...book,
        author: authorList.find(singleAuthor => book.authors.includes(singleAuthor.name))
      })
      await newBook.save()
    })
   
  }
seedDB()
}

// Port where the app runs.
const port = process.env.PORT || 8080
const app = express()

// Middleware to enable cors
app.use(cors())

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to your bookFinder API')
})

app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

app.get('/books/title', async (req, res) => {
  const { title } = req.query
  
  if (title) {
    const bookTitle = await Book.find({
      title: {
        $regex: new RegExp(title, "i")
      }
    })
    res.json(bookTitle)
  } else {
    const bookTitle = await Book.find()
    res.json(bookTitle)
  }
})

app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params
  const singleBook = await Book.findById(bookId)

  if (singleBook) {
    res.json(singleBook)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/authors/:id/books', async (req, res) => {
  const { id } = req.params
  const author = await Author.findById(id)

  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id)})
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import booksData from './booksData/books.json'


//Book modell and author model and relate a book to an author, the connection to yhe database 
//database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//defining models
const Author = mongoose.model('Author', {
  name: String,
})

const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// if (process.env.RESET_DATABASE) {


// const populateDatabase = () => {
//   Author.deleteMany()
   
//   booksData.forEach (item => {
//     const newAuthor = new Author(item)
//      newAuthor.save()
//    }) 
//   }
//    populateDatabase()
// }


if (process.env.RESET_DATABASE) {

const seedDatabase = async () => {
  await Author.deleteMany()
  await Book.deleteMany()
  
    const tolkien = new Author({ name: 'J.R.R Tolkien' })
    await tolkien.save()
  
    const rowling = new Author({ name: 'J.K Rowling' })
    await rowling.save()

    await new Book ({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
    await new Book ({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
    await new Book ({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
    await new Book ({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
    await new Book ({ title: "Harry Potter and the Philosopher's stone", author: rowling }).save()
  
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Wooooorld')
})


app.get('/authors', async (req, res) => {
  // console.log(authors)
  const authors = await Author.find()
  res.json(authors)
  
})

app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.json(404).json({ error })
  }
  
})

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
  
})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author){
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id)})
  res.json(books)
  } else {
    res.json(404).json({ error })
  }
  
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
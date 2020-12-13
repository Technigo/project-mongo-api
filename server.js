import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Author = mongoose.model('Author', {
  bookID: Number,
  title: String,
  authors: String,
})

//const Author = mongoose.model('Author', {
 // name: String,
//})

const Book = mongoose.model('Book', {
  title: String,
  author: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Author.deleteMany()
    await Book.deleteMany()

    booksData.forEach((authorData) => {
      new Author(authorData).save()
    }) 
  
    //const tolkien = new Author({ name: 'J.R.R Tolkien'})
    //await tolkien.save()
    
    const rowling = new Author({ name: 'J.K Rowling' })
    await rowling.save()
    
    await new Book ({ title: "Harry Potter", author: rowling }).save()
  }
  seedDatabase()
}

//   PORT=9000 npm start
const port = process.env.PORT || 8095
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())



// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})


app.get('/authors', async ( req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/authors/:authors', async ( req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: 'No Author found' })
  }
})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if(author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'No Author found' })
  } 
})

app.get('/books', async (req,res) => {
  const books = await Book.find().populate('author')
  if(books) {
    res.json(books) 
  } else {
    res.status(404).json({ error: 'No books found'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import booksData from './data/books.json'


//Author model and connection to database 
//database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()


//defining models
const Author = mongoose.model('Author', {
  title: String,
  authors: String,
  isbn: Number
})

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


if (process.env.RESET_DATABASE) {

const seedDatabase = async () => {
  await Author.deleteMany()


  booksData.forEach (item => {
       const newAuthor = new Author(item)
         newAuthor.save()
        }) 
 
  }
  seedDatabase()
}

// Routes here
app.get('/', (req, res) => {
  res.send('Welcome, this is the restfull Authors Backend')
})


app.get('/authors', async (req, res) => {
  const allAuthors = await Author.find(req.query)
   console.log(allAuthors)

   if (allAuthors.length > 0) {
    res.json(allAuthors)
  } else {
    res.status(404).json({ error: 'Sorry, could not find the data'})
  }
  
})

// //get singel author
// app.get('/authors/author/:id', async (req, res) => {
//   const singleAuthor = await Author.findOne({id: req.params.id})
//   if (singleAuthor) {
//     res.json(singleAuthor)
//   } else {
//     res.status(404).json({ error: 'Sorry, could not find the author' })
//   }
  
})

// app.get('/books', async (req, res) => {
//   const books = await Book.find().populate('author')
//   res.json(books)
  
// })

// app.get('/authors/:id/books', async (req, res) => {
//   const author = await Author.findById(req.params.id)
//   if (author){
//     const books = await Book.find({ author: mongoose.Types.ObjectId(author.id)})
//   res.json(books)
//   } else {
//     res.json(404).json({ error })
//   }
  
// })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
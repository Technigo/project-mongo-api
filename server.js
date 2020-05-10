import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { MongooseDocument } from 'mongoose'
import { stringify } from 'querystring'
// import netflixData from './data/netflix-titles.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Director = mongoose.model('Director', {
  name: String 
})

const Movie = mongoose.model('Movie', {
  title: String,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  } 
})

 if (process.env.RESET_DATABASE) {
   console.log('Resetting database!')

const seedDatabase = async () => {
  await Director.deleteMany()
  await Movie.deleteMany()

  const scorsese = new Director({ name: 'Martin Scorsese'})
  await scorsese.save()

  const spielberg = new Director({ name: 'Steven Spielberg'})
  await spielberg.save()

  await new Movie({ title: "The Irishman", director: scorsese }).save()
  await new Movie({ title: "The Departed", director: scorsese }).save()
  await new Movie({ title: "Schindlers List", director: spielberg }).save()
  await new Movie({ title: "Jurassic Park", director: spielberg }).save()
}
seedDatabase()
}

const port = process.env.PORT || 5000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Endpoints= /directors & /directors/:id & /directors/:id/movies & /movies')
})

app.get('/directors', async (req, res) => {
  const directors = await Director.find()
  res.json(directors)
})

app.get('/directors/:id', async (req, res) => {
  const director = await Director.findById(req.params.id)
  if (director) {
  res.json(director)
  } else {
    res.status(404).json({ error: 'Director not found' })
  }
})

app.get('/directors/:id/movies', async (req, res) => {
  const director = await Director.findById(req.params.id)
  if (director) {
  const movies = await Movie.find({ director: mongoose.Types.ObjectId(director.id) })
  res.json(movies)
  } else {
    res.status(404).json({ error: 'Director not found' })
  }
})

app.get('/movies', async (req, res) => {
  const movies = await Movie.find().populate('director')
  res.json(movies)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

// const Author = mongoose.model('Author', {
//   name: String
// })

// const Book = mongoose.model('Book', {
//   title: String,
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Author'
//   }
// })

// if (process.env.RESET_DATABASE) {
//   console.log('Resetting database!')

//   const seedDatabase = async () => {
//     await Author.deleteMany()
//     await Book.deleteMany()

//     const coelho = new Author ({ name: 'Paulo Coelho' })
//     await coelho.save()

//     const echart = new Author ({ name: 'Echart Tolle' })
//     await echart.save() 


//     await new Book({ title: "The Alchemist", author: coelho }).save()
//     await new Book({ title: "The Power of Now", author: echart }).save()
 
// }
// seedDatabase()

// }
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start


// app.get('/authors', async (req, res) => {
//   const authors = await Author.find()
//   res.json(authors)
// })

// app.get('/authors/:id', async (req, res) => {
//   const author = await Author.findById(req.params.id)
//   if (author) {
//     res.json(author)
//   } else {
//     res.status(404).json({ error: 'Author not found' })
//   }
  
// })

// app.get('/authors/:id/books', async (req, res) => {
//   const author = await Author.findById(req.params.id)
//   if (author) {
//   const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
//   res.json(books)
//   } else {
//     res.status(404).json({ error: 'Author not found' })
//   }
// })

// app.get('/books', async (req, res) => {
//   const books = await Book.find().populate('author')
//   res.json(books)
// })


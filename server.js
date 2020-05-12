import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const NetflixShow = mongoose.model('NetflixShow', {
  show_id: { type: Number },
  title: { type: String },
  director: { type: String },
  cast: { type: String },
  country: { type: String },
  date_added: { type: String },
  release_year: { type: Number },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  description: { type: String },
  type: { type: String },
})

if (process.env.RESET_DB) {

  console.log('Resetting Database!')

  const seedDatabase = async () => {
    await NetflixShow.deleteMany({})

    netflixData.forEach((show) => {
      new NetflixShow(show).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Netflix Shows')
})
 
app.get('/netflixshow', async (req, res) => {
  const { type } = req.query
  let shows = await NetflixShow.find()
  if (type) {
    shows = shows.filter((show) => show.type.toString() === type)
  }
  res.json(shows)
})




app.get('/netflixshow/title/:title', async (req, res) => {
  const { title } = req.params
  const show = await NetflixShow.findOne({ title: title })
  if (show) {
    res.json(show);
  } else {
    res.status(404).json({ error: `Could not find ${title}` })
  }
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

/*

const Author = mongoose.model('Author', {
  name: String
})

const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

if (process.env.RESET_DB) {
  console.log('Resetting Database!')
  const seedDatabase = async () => {
    await Author.deleteMany()

    const rowling = new Author({ name: 'J.K.  Rowling' })
    await rowling.save()
    const tolkien = new Author({ name: 'J.R.R. Tolkien' })
    await tolkien.save()
    const gaiman = new Author ({ name: 'Neil Gaiman'})
    await gaiman.save()
    const colfer = new Author({ name: 'Eoin Colfer'})
    await colfer.save()

    await Book.deleteMany()

    await new Book({ title: "Harry Potter and the Philiospher's Stone", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Half Blood Pince", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
    await new Book({ title: "The Hobbit", author: tolkien }).save()
    await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
  }
seedDatabase()
}

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }

})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
}) */

/*
const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
}) */

/*
Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 4, isFurry: true }).save()
  new Animal({ name: 'Kurt', age: 2, isFurry: true }).save()
  new Animal({ name: 'Sara', age: 1, isFurry: false }).save()
})

app.get('/', (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
})

app.get('/:name', (req, res) => {
  Animal.findOne({ name: req.params.name }).then(animal => {
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  })
}) */
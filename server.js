import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import endpoints from 'express-list-endpoints'

import goldenData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/nominations'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const MovieNominee = mongoose.model('MovieNominee', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  nominee: String,
  film: String,
  win: Boolean,
})

const Category = mongoose.model('Category', {
  category: String,
})

if (process.env.RESET_DATABASE) {
  const seedDataBase = async (res) => {
    console.log('Resetting database!')
    await Category.deleteMany()
    await MovieNominee.deleteMany()

    let categoryDocuments = []

    const categories = goldenData.map(item => item.category)
    const categorySet = new Set(categories)

    categorySet.forEach(item => {
      const category = new Category({category: item})
      categoryDocuments.push(category)
      category.save((error) => {
        if (error) return console.log(error)
      })
    })

    goldenData.forEach(item => {
      const nomination = new MovieNominee({
        ...item,
        category: categoryDocuments.find(category => category.category === item.category)
      })
      nomination.save((error, item) => {
        if (error) return console.log(error)
      })
    })

  }
  seedDataBase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(endpoints(app))
})

app.get('/nominations', async (req, res) => {
  const movieNominations = await MovieNominee.find()
  res.json(movieNominations)
})

app.get('/categories', async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

app.get('/categories/:id/', async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (category) {
    res.json(category)
  } else {
    res.status(404).json({ error: 'No category found' })
  }
})

app.get('/categories/:id/nominations', async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (category) {
    const nominations = await MovieNominee.find({
      category: mongoose.Types.ObjectId(category.id),
    })
    res.json(nominations)
  } else {
    res.status(404).json({ error: 'No nominations found' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

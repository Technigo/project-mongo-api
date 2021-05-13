/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

import { categoriesJason } from './data/golden-globes-categories'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const nomineeSchema = new mongoose.Schema({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  nominee: String,
  film: String,
  win: Boolean
})

const categorySchema = new mongoose.Schema({
  description: String
})
const Category = mongoose.model('Category', categorySchema)

const Nomenee = mongoose.model('Nomenee', nomineeSchema)

if (process.env.RESET_D) {
  const seedDB = async () => {
    await Nomenee.deleteMany()
    await Category.deleteMany()

    const categoriesArray = []

    categoriesJason.forEach(async (item) => {
      const category = new Category(item)
      categoriesArray.push(category)
      await category.save()
    })

    await goldenGlobesData.forEach(async (nomenee) => {
      const newNominee = new Nomenee({
        ...nomenee,
        // eslint-disable-next-line max-len
        category: categoriesArray.find((oneCategory) => oneCategory.description === nomenee.category)
      })
      await newNominee.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/categories', async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

app.get('/nomenees', async (req, res) => {
  try {
    const { awardYear, nominee, page, perPage } = req.query
    const query = {}
    if (awardYear) {
      query.year_award = awardYear
    }
    if (nominee) {
      query.nominee = { $regex: new RegExp(nominee, "i") }
    }
    const nomenees = await Nomenee.find(query).populate('category').skip(((Number(page) - 1) * Number(perPage))).limit(Number(perPage))
    res.json(nomenees);
  } catch (error) {
    res.status(400).json({ error })
  }
})

app.get('/nomenees/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params
    const nomeneesCategory = await Nomenee.find({ category: categoryId })
    if (nomeneesCategory) {
      res.json(nomeneesCategory);
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
});

app.get('/winners', async (req, res) => {
  try {
    const winners = await Nomenee.find({ win: true });
    res.json(winners);
  } catch (error) {
    res.status(400).json({ error })
  }
});

app.get('/winners/:id', async (req, res) => {
  try {
    const { id } = req.params
    const winner = await Nomenee.findById(id)
    if (winner) {
      res.json(winner)
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
})

app.get('/winners/:id/category', async (req, res) => {
  const { id } = req.params
  try {
    const winner = await Nomenee.findOne({ _id: id })
    const categoryOfWinner = await Category.findById(winner.category);
    res.json(categoryOfWinner)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

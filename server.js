/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

import { categoriesJason } from './data/golden-globes-categories'

// const allCategories = []
// goldenGlobesData.forEach((item) => {
//   if (allCategories.indexOf(item.category) === -1) {
//     allCategories.push(item.category)
//   }
// })

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

app.get('/nomenees', async (req, res) => {
  const nomenees = await Nomenee.find();
  res.json(nomenees);
});

app.get('/nomenees/:categoryId', async (req, res) => {
  const { categoryId } = req.params
  console.log(categoryId)
  const nomeneesCategory = await Nomenee.find({ category: categoryId });
  res.json(nomeneesCategory);
});

app.get('/winners', async (req, res) => {
  const winners = await Nomenee.find({ win: true });
  res.json(winners);
});

app.get('/winners/:id', async (req, res) => {
  const { id } = req.params
  const winner = await Nomenee.findOne({ _id: id })
  res.json(winner)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

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

const Nominee = mongoose.model('Nominee', nomineeSchema)

if (process.env.RESET_D) {
  const seedDB = async () => {
    await Nominee.deleteMany()
    await Category.deleteMany()

    const categoriesArray = []

    categoriesJason.forEach(async (item) => {
      const category = new Category(item)
      categoriesArray.push(category)
      await category.save()
    })

    await goldenGlobesData.forEach(async (nominee) => {
      const newNominee = new Nominee({
        ...nominee,
        // eslint-disable-next-line max-len
        category: categoriesArray.find((oneCategory) => oneCategory.description === nominee.category)
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

app.get('/', (req, res) => {
  res.send(listEndpoints(app));
})

app.get('/categories', async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

app.get('/nominees', async (req, res) => {
  const { awardYear, nominee, page, perPage } = req.query
  try {
    const query = {}
    if (awardYear) {
      query.year_award = awardYear
    }
    if (nominee) {
      query.nominee = { $regex: new RegExp(nominee, "i") }
    }
    const nominees = await Nominee.find(query).populate('category').skip(((Number(page) - 1) * Number(perPage))).limit(Number(perPage))
    res.json(nominees);
  } catch (error) {
    res.status(400).json({ error })
  }
})

app.get('/categories/:categoryId/nominees', async (req, res) => {
  const { categoryId } = req.params
  const { awardYear, nominee, film, win } = req.query
  
  try {
    const query = {}
    query.category = categoryId
    if (awardYear) {
      query.year_award = awardYear
    }
    if (nominee) {
      query.nominee = { $regex: new RegExp(nominee, "i") }
    }
    if (film) {
      query.film = { $regex: new RegExp(film, "i") }
    }
    if (win) {
      query.win = win
    }
    
    const nomineesCategory = await Nominee.find(query).populate('category')
    if (nomineesCategory) {
      res.json(nomineesCategory);
    } else {
      res.status(404).json({ error: "Not found" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
});

app.get('/winners', async (req, res) => {
  const { nominee, film, page, perPage } = req.query
  try {
    const winners = await Nominee.aggregate([
      {
        $match: {
          win: true,
          nominee: {
            $regex: new RegExp(nominee || "", "i")
          },
          film: {
            $regex: new RegExp(film || "", "i")
          }
        }
      },
      {
        $project: {
          _id: 0,
          nominee: 1,
          film: 1,
          year_award: 1,
          category: 1
        }
      },
      {
        $skip: Number((page - 1) * perPage + 1)
      },
      {
        $limit: Number(perPage)
      }
    ]);
    res.json(winners);
  } catch (error) {
    res.status(400).json({ error })
  }
});

app.get('/winners/:id', async (req, res) => {
  const { id } = req.params
  try {  
    const winner = await Nominee.findById(id)
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
    const winner = await Nominee.findById({ id })
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

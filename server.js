import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nominations"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const MovieNominee = mongoose.model('MovieNominee', {
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

const Category = mongoose.model('Category', {
  category: String
})

const Award = mongoose.model('Award', {
  year_award: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  win: Boolean
})

const seedCategories = async () => {
  await Category.deleteMany()

  const motionPictureDrama = new Category({
    'category': 'Best Motion Picture - Drama'
  })
  await motionPictureDrama.save()

  const motionMusicalComedy = new Category({
    'category': 'Best Motion Picture - Musical or Comedy'
  })
  await motionMusicalComedy.save()

  const actressDrama = new Category({
    'category': 'Best Performance by an Actress in a Motion Picture - Drama'
  })
  await actressDrama.save()

  const actorDrama = new Category({
    'category': 'Best Performance by an Actor in a Motion Picture - Drama'
  })
  await actorDrama.save()

  const actressComedyMusical = new Category({
    'category': 'Best Performance by an Actress in a Motion Picture - Musical or Comedy'
  })
  await actressComedyMusical.save()

  const actorComedyMusical = new Category({
    'category': 'Best Performance by an Actor in a Motion Picture - Musical or Comedy'
  })
  await actorComedyMusical.save()

  const supportingActress = new Category({
    'category': 'Best Performance by an Actress in a Supporting Role in any Motion Picture'
  })
  await supportingActress.save()

  const supportingActor = new Category({
    'category': 'Best Performance by an Actor in a Supporting Role in any Motion Picture'
  })
  await supportingActor.save()
}

if(process.env.RESET_DATABASE){
  const seedDataBase = async () => {
    console.log('Resetting database')
    await MovieNominee.deleteMany()
    await Category.deleteMany()

  const motionPictureDrama = new Category({
    'category': 'Best Motion Picture - Drama'
  })
  await motionPictureDrama.save()

  const motionMusicalComedy = new Category({
    'category': 'Best Motion Picture - Musical or Comedy'
  })
  await motionMusicalComedy.save()

    const avatar = new MovieNominee({
      "year_film": 2009,
      "year_award": 2010,
      "ceremony": 67,
      "category": motionPictureDrama,
      "nominee": "Avatar",
      "film": "",
      "win": true
    })
    await avatar.save()
  
    const hurtlocker = new MovieNominee({
        "year_film": 2009,
        "year_award": 2010,
        "ceremony": 67,
        "category": motionPictureDrama,
        "nominee": "Hurt Locker, The",
        "film": "",
        "win": false
    })
    await hurtlocker.save()
    const hangover = new MovieNominee({
      "year_film": 2009,
      "year_award": 2010,
      "ceremony": 67,
      "category": motionMusicalComedy,
      "nominee": "Hangover, The",
      "film": "",
      "win": true
  })
  await hangover.save()
  }
  seedDataBase()
  //seedCategories()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/categories', async(req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

app.get('/categories/:id/', async (req, res) => {
  const category = await Category.findById(req.params.id)
  if(category) {
    res.json(category)
  } else {
    res.status(404).json({error: 'No category found'})
}
})

app.get('/categories/:id/nominations', async (req, res) => {
  const category = await Category.findById(req.params.id)
  if(category) {
    const nominations = await MovieNominee.find({ category: mongoose.Types.ObjectId(category.id) })
    res.json(nominations)
  } else {
    res.status(404).json({error: 'No nominations found'})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

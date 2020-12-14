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
    category: String,
    nominee: String,
    film: String,
    win: Boolean
})

const seedDataBase = async () => {
  const avatar = new MovieNominee({
    "year_film": 2009,
    "year_award": 2010,
    "ceremony": 67,
    "category": "Best Motion Picture - Drama",
    "nominee": "Avatar",
    "film": "",
    "win": true
  })
  await avatar.save()
}

seedDataBase()

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/nominations', async (req, res) => {
  const nominations = await MovieNominee.find()
  res.json(nominations)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

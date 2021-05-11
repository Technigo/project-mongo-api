import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const nomineeSchema = new mongoose.Schema({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

const Nominee = mongoose.model('Nominee', nomineeSchema)

if(process.env.RESET_DB) {
  const seedDB = async () => {
    await Nominee.deleteMany()

    await goldenGlobesData.forEach(item => {
      const newNominee = new Nominee(item)
      newNominee.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
//Home
app.get('/', (req, res) => {
  res.send('Hello word')
})

//all nominees
app.get('/nominees', async (req, res) => {
  const nominees = await Nominee.find()
  res.json(nominees)
})



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

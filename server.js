import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Nomination = new mongoose.model('Nomination', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

if (process.env.RESET_DB) {
	const fixedDatabase = async () => {
    await Nomination.deleteMany();
		goldenGlobesData.forEach(item => {
      const newNominations = new Nomination(item);
      newNominations.save();
		})
  }
  fixedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/nominations', async (req, res) => {
  
  const getNominations = await Nomination.find(req.query)

  if (getNominations) {
    res.json(getNominations)
  } else {
    res.status(404).json({ error: 'There is no nomination like this'})
  }
})

app.get('/nominations/:nominee', async (req, res) => {
  // const { nominee } = req.params
  const fixedNominations = await Nomination.findOne({ nominee: req.params.nominee })

  if (fixedNominations) {
  res.json(fixedNominations)
  } else {
    res.status(404).json({ error: 'There is no year like this'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


const Globe = new mongoose.model('Globe', {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: {
      type: Boolean,
      required: true 
    } 
});


if (process.env.RESET_DATABASE) {

  const populateDatabase = async () => {
    await Globe.deleteMany();

    goldenGlobesData.forEach(item => {
      const newGlobe = new Globe(item)
      newGlobe.save();
    })
  }
  populateDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Internet')
})

app.get('/globes', async (req, res) => {
  const queryParameters = req.query;
  console.log(queryParameters);

  const allGlobes = await Globe.find(req.query);
  res.json(allGlobes);
})

app.get('/globes/:nominee', async (req, res) => {
  const globeNominee = await Globe.findOne({ nominee: req.params.nominee });

  res.json(globeNominee);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
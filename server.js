import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'
//console.log(goldenGlobesData)

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-anna"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Properties: key & value-pair. Constructor = new mongoose.model(). Function that
// takes two arguments: a string and an object. Calling a function with two arg.
// The object is called schema. Then we populate with instances of model with the
// properties of object.
const Nomination = new mongoose.model('Nomination', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
});

// Start MongoDB: RESET_DB=true npm run dev
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Nomination.deleteMany();

		goldenGlobesData.forEach(item => {
      const newNomination = new Nomination(item);
      newNomination.save();
		})
  }
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example: PORT=9000 npm start
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
  const allNominations = await Nomination.find();
  res.json(allNominations);
})

app.get('/nominations/:nominee', async (req, res) => {
  // const { nominee } = req.params  SAME as below
  // find() returns array, findOne() returns object. The first in order to match.
  const singleNominee = await Nomination.findOne({ nominee: req.params.nominee });
  res.json(singleNominee);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

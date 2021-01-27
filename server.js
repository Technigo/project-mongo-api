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


const Nomination = new mongoose.model('Nomination', {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: Boolean, 
});


if (process.env.RESET_DATABASE) {

  const populateDatabase = async () => {
    await Nomination.deleteMany();

    goldenGlobesData.forEach(item => {
      const newNomination = new Nomination(item)
      newNomination.save();
    })
  }
  populateDatabase();
}

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable '})
  }
})

// Start defining your routes here
// 1
app.get('/', (req, res) => {
  res.send('Hello Internet')
})

//FUNGERAR 
// Returns all the nominations 
// 2 
app.get('/nominations', async (req, res) => {
  const allNominations = await Nomination.find(req.query);
  if (allNominations) {
    res.json(allNominations)
  } else {
    res.status(404).json({ error: 'Not found'})
  }
})

//FUNGERAR 
//Returns all the nominations for a specific movie or actor 
// 3
app.get('/nominations/:nominee', async (req, res) => {
  const oneNominee = await Nomination.find({ nominee: req.params.nominee });
  if (oneNominee) {
    res.json(oneNominee)
  } else {
    res.status(404).json({ error: 'Nominee not found' })
  }
})

//FUNGERAR
// Returns winners from a certain year 
// 4
app.get('/nominations/:year', async (req, res) => {
  const year = req.params.year
  const showWon = req.query.win 
  let nominationsFromYear =  await goldenGlobesData.filter((item) => item.year_award === +year)

  if (showWon) {
    nominationsFromYear = nominationsFromYear.filter((item) => item.win)
  }

  res.json(nominationsFromYear)
})


// // Returns year/ category / winner 
// app.get('/nominations/:cermony/:category/winner', async (req, res) => {
//   const { cermony, category } = req.params
//   let categoryWinner = await Nomination.find(
//   { 
//     category: category, 
//     cermony: cermony, 
//     win: true
//   })
//   res.json(categoryWinner)
// })



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})



// 1
// 2 
// 3 http://localhost:9000/nominations/2011?win=true
// 4 
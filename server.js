import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import techFundings from './data/tech_fundings.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, {useNewUrlParser:true, useUnifiedTopology: true})
mongoose.Promise = Promise



// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const Company = mongoose.model('Company', {
  index: Number,
  company: String,
  website: String,
  region : String,
  vertical: String,
  fundingAmountUSD: Number,
  fundingStage: String,
  fundingDate: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Company.deleteMany({})

    techFundings.forEach(item => {
      const newCompany = new Company(item)
      newCompany.save()
    })
  }

  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// our own middleware that checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// First endpoint
app.get('/', (req, res) => {
  res.send('Yay, a database!')
})

// get all companies
app.get('/companies', async (req, res) => {
  console.log(req.query)
  let companies = await Company.find(req.query)

  if (req.query.fundingAmountUSD) {
    const companiesByAmount = await Company.find().gt('fundingAmountUSD', req.query.fundingAmountUSD)
    companies = companiesByAmount
  }

  res.json(companies)
})

//get one company based on id
app.get('/companies/id/:id', async (req, res) => {
  try {
    const companyById = await Company.findById(req.params.id)
    if (companyById) {
      res.json(companyById)
    } else {
      res.status(404).json({error:"This didn't work"})
    }
  } catch(err) {
    res.status(404).json({error: 'ERROR!'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is so running on http://localhost:${port}`)
})

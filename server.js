import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import data from './data/yale-ceo-russia-sanctions.json'

// Info about dataset: 
// All rights belong to the authors (Jeffrey Sonnenfeld et al.), please attirbute to original authors.
// The list below is updated continuously by Jeffrey Sonnenfeld and his team of experts, research fellows, 
// and students at the Yale Chief Executive Leadership Institute to reflect new announcements from companies in as close to real time as possible.
// Over 1,000 companies have publicly announced they are voluntarily curtailing operations in Russia to some degree beyond the bare minimum 
// legally required by international sanctions — but some companies have continued to operate in Russia undeterred.

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Company = mongoose.model('Company', {
  Name: String,
  Action: String,
  Industry: String,
  Country: String,
  Grade: String
})

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Company.deleteMany({})

    data.forEach((companyData) => {
      new Company(companyData).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find()
    if (companies) {
      res.json(companies)
    } else {
      res.status(500).json({ error: 'not found' })
    }
  }
  catch (error) {
    res.status(400).json({ error: 'No data available' })
  }
})

app.get('/companies/:id', async (req, res) => {
  try {
    const specificId = await Company.findById(req.params.id)
    if (specificId) {
      res.status(200).json({
        success: true,
        message: 'OK',
        body: {
          specificId
        }
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Id not found',
        body: {}
      })
    }
  }
  catch (error) {
    res.status(400).json({ error: 'Invalid id search' })
  }
})

app.get('/companies/grade/:grade', async (req, res) => {
  try {
    const { grade } = req.params
    const { country } = req.query

    let gradeResult = await Company.find({ Grade: { '$regex': new RegExp(grade, 'i') } })

    if (country) {
      gradeResult = gradeResult.filter(item => item.Country.match(new RegExp(country, 'i')))
    }

    if (gradeResult.length) {
      res.status(200).json({
        success: true,
        message: `Companies classified by grade ${grade}`,
        body: {
          gradeResult
        }
      })
    } else {
      res.status(404).json({
        success: false,
        message: `No companies match the inserted grade`,
        body: {}
      })
    }
  }
  catch (error) {
    res.status(400).json({ error: 'Invalid search criteria' })
  }
})

// app.get('/titles/movies', (req, res) => {
//   const { year } = req.query
//   let movies = netflixData.filter(item => item.type === 'Movie')

//   if (year) {
//     movies = movies.filter((releaseYear) => {
//       return releaseYear.release_year === Number(year)
//     })

//   }
//   if (movies.length) {
//     res.status(200).json({
//       success: true,
//       message: 'OK',
//       body: {
//         netflixMovies: movies
//       }
//     })
//   } else {
//     res.status(404).json({
//       success: false,
//       message: 'Not found',
//       body: {}
//     })
//   }
// })

app.get('/companies/country/:country', async (req, res) => {
  try {
    const { country } = req.params
    let countryResult = await Company.find({ Country: { '$regex': new RegExp(country, 'i') } })
    if (countryResult.length) {
      res.status(200).json({
        success: true,
        message: `Companies from ${country}`,
        body: {
          countryResult
        }
      })
    } else {
      res.status(404).json({
        success: false,
        message: `No Companies found from ${country}`,
        body: {}
      })
    }
  }
  catch (error) {
    res.status(400).json({ error: 'Invalid country search' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

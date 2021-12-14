import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import nobelPrizeData from './data/nobel-prize.json'
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'


//This is set-up code, can be copy and pasted. The localhost name should be unique.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongo1312kara"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// define model

const Winner = mongoose.model('Winner', {
  firstname: String,
  surname: String,
  bornCountryCode: String,
  diedCountryCode: String,
  gender: String,
  year: Number,
  category: String,
  share: Number,
  nameOfUniversity: String,
  cityOfUniversity: String,
  countryOfUniversity: String,
  bornMonth: String,
  age: Number,
  ageGetPrize: Number
})

if (process.env.RESET_DB) {
  // need to use an async function so that the users are deleted before 
   const seedDatabase = async() => {
   await Winner.deleteMany({})
   
   // going to loop through all companies and add to database

   nobelPrizeData.forEach(item => {
     
    const newWinner = new Winner(item)
    newWinner.save()
   })
  }
  seedDatabase()
}




// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello all')
})
/*here is my winners endpoint, viewable in browser or postman. Have to use Mongoose
mehtods rather than just normal JS we could use with express*/
app.get('/winners', async (req, res) => {
  const winners = await Winner.find()
  res.json(winners)
})

app.get('/')

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import nobelPrizeData from './data/nobel-prize.json'

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

// define model using a Schema for each Winner

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

//Fills database with data from my API
if (process.env.RESET_DB === 'true') {
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
  res.send('Hello all, add / in browser to view all endpoints')
})
// to view all endpoints
app.get('/endpoints', (req,res )=> 
res.send(listEndpoints(app)))

/*here is my winners endpoint, viewable in browser or postman. Have to use Mongoose
mehtods rather than just normal JS we could use with express*/
app.get('/winners', async (req, res) => {
  const allWinners = await Winner.find()
  res.json(allWinners)
})
// end point to find all winners in given category
app.get('/winners/:category', async (req, res) =>{
  const categoryWinners = await Winner.find({category:req.params.category})
  res.json(categoryWinners)
})

// endpoint to find all winners in any give year
app.get('/winners/year/:year', async (req, res) =>{
  const yearWinners = await Winner.find({year:req.params.year})
  res.json(yearWinners)
})

app.get('/winners/surname/:surname', async (req,res) =>{
  const surname =req.params.surname
  const surnameWinner = await Winner.find({surname})
  res.json(surnameWinner)
})
/*endpoint to find any category winner in any given year

app.get ('/winners/category/:category/year/:year', async (req, res) =>{
  const { year } = req.params
  const { category } = req.params
  const categoryYearWinners = await Winner.find({category}&& {year})
  res.json(categoryYearWinners)
})
*/

// get one winner based on id
app.get ('/winners/id/:id', async (req, res)=> {
  const id = req.params.id
  const winnerById = await Winner.findById(id)
  res.json(winnerById)
})



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import bootcamps from './data/bootcamps.json'

//these 3 lines are responsible for connecting the server to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//To create the schema with data types
const bootcampSchema = new mongoose.Schema({
  name: String,
  image: String,
  review: String,
  courses: String,
  subjects: String,
  description: String,
  cost: String,
  duration: String,
  isFlexible: Boolean,
  guaranteesJob: Boolean ,
  hasGenderPerspective: Boolean,
  url: String  
})

//To create the Bootcamp model
const Bootcamp = mongoose.model('Bootcamp', bootcampSchema)

//Seeding the database. Will only run if
// RESET_DB environment variable is present and is true
if (process.env.RESET_DB) {
  console.log('SEEDING!')
  const seedDatabase = async () => {
   await Bootcamp.deleteMany()

//Creates a new entry for each bootcamp
  await bootcamps.forEach(item => {
    const newBootcamp = new Bootcamp(item)
    newBootcamp.save()
  })
}
seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080

const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})
//The endpoint to get all the coding bootcamps in the list or filter by guaranteed job, gender perspective or id
app.get('/bootcamps', async (req, res) => {
  const { name, guaranteesJob, hasGenderPerspective } = req.query

  if (name) {
    const bootcamps = await Bootcamp.find({
      name: {
        $regex: new RegExp(name, "i")}
    })
    res.json(bootcamps)
  }

  if (guaranteesJob) {
    const bootcamps = await Bootcamp.find({
      guaranteesJob:true
    })
    res.json(bootcamps)
  }

  if (hasGenderPerspective) {
    const bootcamps = await Bootcamp.find({
      hasGenderPerspective: true
    })
    res.json(bootcamps)
  }

  const bootcamps = await Bootcamp.find()
  res.json(bootcamps)

//Endpoint to query bootcamps by id
app.get('/bootcamps/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleBootcamp = await Bootcamp.findById(id)//an alternative to .findOne()
    res.json(singleBootcamp)
  } catch(error) {
    res.status(404).json({ error: `Sorry, we could not find a bootcamp with the id ${id}`, details: error })
  }

})

  // v1 -async await
  // const members = await Member.find()
  //res.json(songs)

  //v2 - promise (classic)
  // Member.find().then(data => {
    //res.json(data)
  //})

  //v3 - mongoose
  //Member.find((err, data) => {
   // res.json(data)
  //})

})
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

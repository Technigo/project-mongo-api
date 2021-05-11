import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixTitles from './data/netflix-titles.json'
console.log(netflixTitles.length) // 7787 objects

// Task error handling for the mongoose connection ! Good to practice ** 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// RESET_DB=true npm run dev - --- INITIALIZE THE DATABASE *

const titlesSchema = new mongoose.Schema({
  //_id: { type: String, required: true }, // Added --->  make _id to a string. if not want to deal with _id and id?
  show_id: String,
  type: String,
  title: {
    any: mongoose.Schema.Types.Mixed
  },// can also be a number. --> earlier: String, // now:  ({ any: Schema.Types.Mixed })
  director: {
    type: mongoose.Schema.Types.ObjectId, //upon adding a new post ---> _id: _id, Schema.Types.Mixed
    ref: 'Director'
  }, //String, */
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String, 
  duration: String,
  listed_in: String,
  description: String
})

// 1st argument Title, 2nd argument the Schema
const Title = mongoose.model('Title', titlesSchema) //mongoDB takes the string 'Title' and changing the Uppercase to lowercase member + s = titles

const Director = mongoose.model('Director', { //Name same as variable - a rule of thumb
  name: String
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Title.deleteMany()
    await Director.deleteMany()

    let directors = []

    // You need to have array with all of the directors inside, so we can loop over it to create document for each one of them
    directorsData.forEach(async item => {
      const director = new Director(item)
      
      directors.push(director)
      await director.save()
    })
  
    netflixTitles.forEach(async item => {
      const title = new Title({
        ...item,
        director: directors.find(singleDirector => singleDirector.name === item.director)
      })
      await title.save()
    })
    seedDB()
  }
}


const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
}) 

// return all titles
app.get('/titles', async (req, res) => {
  // v 1 universal version
  const titles = await Title.find().populate('director') // populate title with director object
  res.json(titles) // or netflixTitles
})

// Return the id of one netflix title
app.get('/titles/:id', async (req, res) => {
  console.log(mongoose.isValidObjectId(req.params.id)) // 
  const title = await Title.findById(req.params.id)
  res.json(title)
})

//60992b36fea8157986d330be

app.get('/directors/:id', async (req, res) => {
  //console.log(mongoose.isValidObjectId(req.params.id))
  const director = await Director.findById(req.params.id)

  res.json(director)
 /*  const title = await Title.find({ director: mongoose.Types.ObjectId(director.id) })
  //if (director) {
    res.json(title) */
/*   } else {
    res.status(404).json({ error: 'title not found'})
  } */
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

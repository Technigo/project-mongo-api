import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//API input
import { GoldenGlobeData } from './data/golden-globes.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Nominee = mongoose.model('Nominee', {

  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean,

})

 if (process.env.RESET_DATABASE === true) {
     console.log('Resettnig database...');
  
    const seedDatabase = async () => {
      await Nominee.deleteMany();

      await GoldenGlobeData.forEach((nominee) => new Nominee(nominee).save());
    
  }

  seedDatabase()
}


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello! use these routes')
})

app.get('/nominees', async (req, res) => {
  const goldenGlobenom = await Nominee.find()
  res.json(goldenGlobenom)
})

// app.get('/netflixtitles', async (req, res) => {
//  const Netflixtitles = await Netflixtitle.find().populate('title')
//  res.json(Netflixtitles)
// })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})




// Method	Endpoints	Notes
// GET	/product	Get all products
// GET	/product/:id	Get single product
// POST	/product	Add product
// PUT	/product/:id	Update product
// DELETE	/product/:id	Delete product
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import ceremonies from './data/golden-globes.json'

//setup to connect to our database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Fields of our model
const ceremonySchema = new mongoose.Schema ({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})
//Model from the ceremonySchema
const Ceremony = mongoose.model('Ceremony', ceremonySchema)

//Seeding of our database
if (process.env.RESET_DB) {
  console.log('SEEDING')
  const seedDB = async () => {
    await Ceremony.deleteMany()

    await ceremonies.forEach(item => {
      const newCeremony = new Ceremony(item)
      newCeremony.save()
    })
  }    
  seedDB()
}
  
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hola world')
})

//Reaching for all the ceremonies
app.get('/ceremonies', async (req, res) => {
  const ceremonies = await Ceremony.find();
  res.json(ceremonies)
})
//looking for one specific ceremony

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

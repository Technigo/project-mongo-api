import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Title = mongoose.model('Title', {

  title: String,

});

const seedDatabase = async () => {

  await Title.deleteMany()

  const title1 = new Title({title: 'Homeland'})
  await title1.save()

  const title2 = new Title({title: 'Once apon a time'})
  await title2.save()

}
seedDatabase()


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())



// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/titles', async (req, res) => {
  const titles = await Title.find()
  res.json(titles)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

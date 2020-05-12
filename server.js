import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/titles"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Title = mongoose.model('Title', {

  title: String,

});

const Netflixtitle = mongoose.model('Netflixtitle', {

  director: String,

  title: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title'
  }

});

if (process.env.RESET_DATABASE) {

const seedDatabase = async () => {

  await Title.deleteMany()
  await Netflixtitle.deleteMany()

  const homeland = new Title({title: 'Homeland'})
  await homeland.save()

  const onceapon = new Title({title: 'Once apon a time'})
  await onceapon.save()

  await new Netflixtitle({ director: "Myers", title: homeland}).save()

}
seedDatabase()
}

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

app.get('/netflixtitles', async (req, res) => {
 const Netflixtitles = await Netflixtitle.find().populate('title')
 res.json(Netflixtitles)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

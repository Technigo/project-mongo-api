import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

// these three lines of code are the essens about the backend being connected to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Member = new mongoose.model('Member', {
  name: String,
  surname: String,
  lettersInName: Number,
  isPapa: Boolean
});

if (process.env.RESET_DATABASE)  {
const booksData = () => {
  Member.deleteMany();

  booksData.forEach(item => {
    const newMember = new Member(item)
    newMember.save();
  })
}
  booksData();
}
// Start defining your routes herecon
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('members', (req, res) => {
  const booksData = Member.find();
  res.json(booksData);
})

app.get('/members/:name', async (req, res) => {
  const singleMember = Member.find({ name: req.params.title })

  res.json(singleMember)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

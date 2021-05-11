import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'


import netflixData from './data/netflix-titles.json'



const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const showSchema = new mongoose.Schema({
  title: String,
  director: String,
  release_year: Number,
  type: String,
  duration: String,
  description: String
})

const Show = mongoose.model('Show', showSchema);

// const newShow = new Show ({
//   title: 'JASON show',
//   director: 'Ylva',
//   release_year: 2021,
//   type: 'TV Show',
//   duration: '120 min',
//   description: 'Best show ever'
// })

// newShow.save()

//TO USE THIS, TYPE: RESET_DB=true npm run dev IN TERMINAL
if (process.env.RESET_DB) {
const seedDB = async () => {
  await ShowData.deleteMany();

  await netflixData.forEach(item => {
    const newShow = new Show(item)
    newShow.save();
  });
}
seedDB();
}




//   PORT=9000 npm start
const port = process.env.PORT || 8082
const app = express()

// Add middlewares to enable cors
app.use(cors()) 
app.use(express.json())


// // Start defining your routes here
// app.get('/', (req, res) => {
//   Show.find().then(show => {
//     res.json(show)
//   })
// })

//http://localhost:8082/list

app.get('/list', async (req, res) => {
  const show = await Show.find();
  res.json(show)
})

app.get('/list/series', async (req, res) =>{
  const data = await Show.find({ type: 'TV Show'})
  res.json(data)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

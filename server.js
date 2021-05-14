import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Serie= mongoose.model('Series', {
  show_id: Number,
  title: {
    type: String,
    lowercase:true
  },
  director: String,
  cast: String,
  country:String,
  date_added: String,
  release_year: Number,
  rating:String,
  duration:String,
  listed_in:String,
  description: String,
  type: String
})

/* const newSerie = new Serie({
  show_id: 80000001,
  title: 'Learning how to code',
  director: 'Technigo',
  cast: 'Maidelin Rubio',
  country:'Sweden',
  date_added: 'January 11 2021',
  release_year: 2021,
  rating:' 5 / 5',
  duration:' 1 season',
  listed_in:'english',
  description: 'journal abour how to code',
  type: 'TV Show'

})
newSerie.save() */

if(process.env.RESET_DB){

  const seedDB = async ()=>{
      await Serie.deleteMany()

      await netflixData.forEach( item=>{
      const newSerie = new Serie(item).save()
      })
  }
  seedDB();
}

const port = process.env.PORT || 8080
const app = express()
 
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
 app.get('/', (req, res) => {
  res.send('Add /series to see all the data ')
})

app.get('/series', async (req, res)=>{
  const series =  await Serie.find()
  res.json(series)
})

app.get('/series/:showId', async (req, res)=>{
  const { showId } =  req.params

  try {
    const oneSerie = await Serie.findOne({show_id: showId})
    res.json(oneSerie)
  } catch(error){
    res.status(400).json({error:'Something went wrong', details: error})
  }
})

app.get('/series/title/:showTitle', async (req, res)=>{
  const { showTitle } =  req.params
  
  try {
    const oneSerie = await Serie.find({show_id: showTitle})
    res.json(oneSerie)
  } catch(error){
    res.status(400).json({error:'Something went wrong', details: error})
  }
})

app.get('/series/type/:type', async (req, res)=>{
  const { type } =  req.params
  const oneSerie = await Serie.find({type: type})
  res.json(oneSerie)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

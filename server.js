import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const GoldenGlobe = mongoose.model('GoldenGlobe', {
  "year_film": {
    type: Number,
  },
  "year_award": {
    type: Number,
  },
  "ceremony": {
    type: Number,
  },
  "category": {
    type: String,
  },
  "nominee": {
    type: String
  },
  "film": {
    type: String,
  },
  "win": {
    type: Boolean,
  },
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
    // Clear our database
    await GoldenGlobe.deleteMany();
    // Save all of the globes from json to the database
    //this second await is not doing anything, but it's good practice to add it, because in some cases it's needed
    await goldenGlobesData.forEach((globe) => new GoldenGlobe(globe).save());
  }
  seedDatabase()
}

const port = process.env.PORT || 8080;
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('This is the Golden Globes API. Possible endpoints: /goldenGlobes (all nominations) (possible queries: film, nominee, category  ), /goldenGlobes/id/:id, /goldenGlobes/:year (possible query: win=true)')
})

//ALL GOLDEN GLOBES UNFILTERED
//Query film (title)
//Query nominees
//Query category
app.get('/goldenGlobes', async (req, res) => {
  const { film, nominee, category, } = req.query
  //A way to tell Mongo how we want to filter this data
  const goldenGlobes = await GoldenGlobe.find({
    //We turn it into a regular expression so we don't have to write the film title verbatum
    //The string that comes in transforms to a regex and in every entry in the database
    //film is checked to see if it matches the string that has been sent in
    //We use a constructor:  new... in this case    new RegExp 
    film: new RegExp(film, 'i'),
    //We're saying to the find function, we want you to filter on the value we're sending in
    //and we want you to filter the film (wich is the film-title) 
    nominee: new RegExp(nominee, 'i'),
    category: new RegExp(category, 'i'),
  })
  console.log(`Found ${goldenGlobes.length} golden globes nominations`)
  res.json(goldenGlobes)
})

//GOLDEN GLOBES FILTERED ON YEAR OF AWARDS
app.get('/goldenGlobes/:year', async (req, res) => {
  const { year } = req.params
  let nominationYear = await GoldenGlobe.find({ year_award: year })
  const nominationWon = req.query.win

  if (nominationYear && nominationWon) {
        nominationYear = nominationYear.filter((item) => item.win === true)
        res.json(nominationYear);
      } else if (nominationYear){
          res.json(nominationYear)
        }else{
          res.status(404).json({ error: 'Not found' })
        }

})
  
  
  
  // if (nominationYear){
  //   res.json(nominationYear)
  // }
  //   if (nominationYear && nominationWon) {
  //     nominationYear = nominationYear.filter((item) => item.win === true)
  //     res.json(nominationYear);
  //   } else {
  //     res.status(404).json({ error: 'Not found' })
  //   }
  // })
  



//GOLDEN GLOBES FILTERED ON ID - RETURNS A SINGLE RESULT
app.get('/goldenGlobes/id/:id', async (req, res) => {
  const goldenGlobes = await goldenGlobes.findById(req.params.id)
  res.json(nominations)
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
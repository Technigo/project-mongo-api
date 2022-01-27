import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const data = goldenGlobesData

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/golden-project-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080
const port = process.env.PORT || 8070 
const app = express()

//An award database model to start populating the database with all existing data
const Award = mongoose.model('Award', {
  filmYear: Number,
  awardYear: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

//Function to start seeding the database & it runs only when variable is present & true
if (process.env.RESET_DB) {
  const seedDataBase = async () => {
  //Deletes pre-existing awards to prevent duplicates
  await Award.deleteMany({});

  //Creates a new Award 
  data.forEach(item => {
    const newAward = new Award(item);
    newAward.save();
  });
};
seedDataBase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Middleware that checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next();
	} else {
		res.status(503).json({ error: 'Service unavailable' });
	}
});

//RESTful routes/endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the Golden-Globes API. Enter /endpoints to see which endpoints there are available.')
})

app.get('/endpoints', (req, res) => {//this endpoint is going to tell us all possible endpoint we have
  res.send(listEndpoints(app))
})

app.get('/nominations', (req, res) => { //this route will display all nominations
  res.json(data)
})

app.get('/nominations/nominee/:nominee', (req, res) => { //nominations per nominee will be shown, if response is given, if not an error is catched
  try {
    const { nominee } = req.params
    const nomineeId = goldenGlobesData.find(item => item.nominee.toLowerCase() === nominee.toLowerCase())

    if(!nomineeId) {
      console.log('No nominee')
      res.status(404).json({
        response: 'No nominee found with that name.',
        success: false
      })
    }  else { 
      res.json(nomineeId)
    }  
  } catch (err) {
		res.status(400).json({ 
      error: 'Invalid nominee, please try again' 
    });
	}
})

app.get('/nominations/category/:category', (req, res) => {
  try {
    const { category } = req.params
    const categoryId = goldenGlobesData.find(item => item.category.toLowerCase() === category.toLowerCase())
  
    if(!categoryId) {
      res.status(404).json({
        response: 'No category found with that name.',
        success: false    
      })
    }  else { 
    res.json(categoryId)
    }
  } catch (err) {
		res.status(400).json({ 
      error: 'Invalid category, please try again' 
    });
	}
});

app.get('/nominations/year/:year', (req, res) => {
  try {
    const year = req.params.year
    const showWin = req.query.win
    let nominationsFromYear = data.filter((item) => item.year_award === +year)
  
    if (!showWin) {
      res.status(404).json({
        response: 'No award found in given year',
        success: false
    })
    } else { 
    nominationsFromYear =  nominationsFromYear.filter((item) => item.win)
    }  
    res.json(nominationsFromYear)
  } catch (err) {
		res.status(400).json({ error: 'Year is invalid, please try again!' });
	}
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

/* eslint-disable no-undef */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import athletesData from './data/athletes-data.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Example of the object from the Json
// "affiliateid": "5885",
//   "affiliatename": "CrossFit Unique",
//   "age": "45",
//   "competitorid": "1071438",
//   "competitorname": "Theresa Ulwahn",
//   "countryoforigincode": "SE",
//   "countryoforiginname": "Sweden",
//   "division": "Women (45-49)",
//   "divisionid": "4",
//   "firstname": "Theresa",
//   "gender": "F",
//   "height": "1.62",
//   "is_scaled": "0",
//   "lastname": "Ulwahn",
//   "overallrank": "1015",
//   "overallscore": "6413",
//   "postcompstatus": "",
//   "profilepics3key": "0bda5-P1071438_3-184.jpg",
//   "weight": "61.0"

const Athlete = mongoose.model('Athlete', {
  competitorid: String,
  competitorname: String,
  age: String,
  overallrank: String,
  affiliatename: String,
  countryoforiginname: String
})

const Box = mongoose.model('Box', {
  affiliateid: String,
  affiliatename: String,
  countryoforiginname: String,
  athlete: {
    //this object is relating to an object-ID from another model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete'
    }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Box.deleteMany({})
    await Athlete.deleteMany({})

    athletesData.forEach(async (athleteData) => {
      const athlete = await new Athlete(athleteData).save()
      new Box({ ...athleteData, athlete }).save()
    })
  }

  seedDatabase()
}
// Another way how to get the athletes to the database
// const addAthletesToDatabase = () => {
//   athletesData.forEach((athlete) => {
//     new Athlete(athlete).save();
//   });
// };
// // addAthletesToDatabase();


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// http://localhost:8080/athletes
// app.get('/athletes', async (req, res) => {
//   const athletes = await Athlete.find()
//   console.log(athletes)
//   res.json(athletes)
// } )

// Searching without mongoose, put a + infront of the id as its a string in the json
// app.get('/athletes/:id', async (req, res) => {
//   const showId = req.params.id 
//     console.log(showId)
//   const show = athletesData.filter(item => +item.competitorid === +showId)
//     console.log("id path parameter")
//   if (show) {
//     res.json(show)
//   } else {
//     res.status(404).json({ error: 'Athlete not found' })
//   }
// })

// http://localhost:8080/athletes?q=Theresa
app.get('/athletes', (req, res) => {
  const queryString = req.query.q;
  const queryRegex = new RegExp(queryString, "i");
  console.log(queryString)
  Athlete.find({'competitorname': queryRegex})
    .sort({'num_pages': -1})
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results);
      res.json(results);
    }).catch((err) => {
      // Error/Failure
      console.log('Error ' + err);
      res.json({message: 'Cannot find this athlete', err: err});
    });
});

// http://localhost:8080/athletes/1071438
app.get('/athletes/:competitorid', (req, res) => {
  const competitorid = req.params.competitorid;
  Athlete.findOne({'competitorid': competitorid})
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      res.json({message: 'Cannot find this athlete', err: err});
    });
});

// http://localhost:8080/boxes
app.get('/boxes', async (req, res) => {
  const boxes = await Box.find().populate('athlete')
  console.log(boxes)
  res.json(boxes)
} )

// http://localhost:8080/boxes/5e3bd6190d6a00044ab2f989/athletes this endpoint whould show all athletes from one box
app.get('/boxes/:id/athletes', async (req, res) => {
  const box = await Box.findById(req.params.id)
  if (box) {
    const athletes = await Athlete.find({ box: mongoose.Types.ObjectId(box.id) })
    res.json(athletes)
  } else {
    res.status(404).json({ error: 'Box not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

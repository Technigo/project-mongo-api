import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Nominee = mongoose.model('Nominee', {
  nominee: String,
  year_award: Number,
  year_film: Number,
  category: String,
  win: Boolean
})

new Nominee({ nominee: 'hej', year_film: 3, year_film: 4, win:true}).save()
new Nominee({ nominee: 'hoj', year_film: 3, year_film: 4, win:true}).save()
new Nominee({ nominee: 'hij', year_film: 3, year_film: 4, win:false}).save()

/*
const User = mongoose.model('User', {
  username: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    minlength: 8
  },
  profilePicture: {
    type: String,
    default: ''
  }
}) */

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Nominee.deleteMany()

    data.forEach((nominee) => {
      new Nominee(nominee).save()
    })
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  Nominee.find().then(nominees => {
    res.json(nominees)
  })
})

app.get('/winners', (req, res) => {
  res.send('Winner of Golden globes 2010-2019')
})

app.get('/:nominee', (req, res) => {
  Nominee.findOne({nominee: req.params.nominee}).then(nominee => {
   if (nominee) {
      res.json(nominee)
   } else {
    res.status(404).json({error: 'Not found'})
   }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

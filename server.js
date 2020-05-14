import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//API input
import { goldenGlobeData } from "./data/golden-globes.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Nominee = mongoose.model('Nominee', {

  year_film: {
    type: Number
  },
  year_award: {
    type: Number
  }, 
  ceremony: {
    type: Number
  },
  category:  {
    type: String
  },
  nominee: {
    type: String
  },
  film: {
    type: String
  },
  win: {
    type: Boolean
  },

})

if (process.env.RESET_DATABASE) {
  console.log("Resetting database...");
  const seedDatabase = async () => {
    await Nominee.deleteMany();
    
    goldenGlobeData.forEach((nominee) => new Nominee(nominee).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello! use these routes /nominees')
})


app.get("/nominees", async (req, res) => {
  let goldenGlobes = await Nominee.find();
  res.json(goldenGlobes);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})




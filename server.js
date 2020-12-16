import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example:
const port = process.env.PORT || 8080
const app = express()
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Create a model for what's stored in the db.
// The Nominee variable is going to be the mongoose model. Create it via the constructor new mongoose.model. Takes two arguments – the name of the model (String), and the object to base objects off of. Blueprint.
const Nominee = new mongoose.model('Nominee', {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: Boolean
})

// Needs to be wrapped in the process.end.RESET_DATABASE – custom env variable as we start the server in the terminal.
// We need to start the server with the custom env variable. 1:07:41 in Maks' Monday lecture. 
// The command for this is RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    // Clear the database
    await Nominee.deleteMany();

    // Re-populate the database
    goldenGlobesData.forEach(item => {
      const newNominee = new Nominee(item)
      newNominee.save()
    })
  }
  populateDatabase()
}


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
  console.log("Inside the / now")
})

app.get('/nominees', async (req, res) =>{
  const allNominees = await Nominee.find(req.query)
  res.json(allNominees)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

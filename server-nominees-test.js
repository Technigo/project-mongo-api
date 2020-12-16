// MONDAY LECTURE

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// New package 👆

// You can name this what you want???? That's mindblowing
import goldenGlobesData from './data/golden-globes.json'
// console.log(goldenGlobesData)

// "mongodb://localhost/project-mongo" IS OUR URL WHICH WE PUT IN THE COMPASS APP.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Clear the database. Access it first.
// Copy one object from the JSON file and change params to the types.
// This object is a model, sort of.
// The variable Member is gonna be our own custom Mongoose model. Create it via the CONSTRUCTOR new Mongoose model.
// Model is a ~function~ that takes two arguments. "Member" and the dummy object.
const Nominee = new mongoose.model('Nominee', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  film: String,
  win: Boolean,
})

// These two are the same things
// fetch('URL')
//   .then(res => res.json())
//   .then(data => console.log(data))
// These two are the same things
const customFetchData = async () => {
  const res = await fetch('URL')
  const data = await res.json()
  console.log(data)
}

// What is this?
if (process.env.RESET_DATABASE) {
  // Function to populate the database. Use Mongoose
  const populateDatabase = async () => {
    // This deleteMany comes from mongoose package. Wipe and populate. 
    await Member.deleteMany();

    goldenGlobesData.forEach(item => {
      const newNominee = new Nominee({ item })
      newMember.save()
    })
  }
}
// In terminal: RESET_DATABASE=true npm run dev



// if (process.env.RESET_DATABASE) {
//   // Function to populate the database. Use Mongoose
//   const populateDatabase = () => {
//     // This deleteMany comes from mongoose package. Wipe and populate. 
//     Member.deleteMany();

//     goldenGlobesData.forEach(item => {
//       const newNominee = new Nominee({ item })
//       newMember.save()
//     })
//   }
// }

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/nominees', async (request, response) => {
  // Should reference the database, not the JSON file.
  // Access ALL the elements via find(). 
  const allNominees = await Nominee.find();
  // Takes all the documents from the Nominees collection.
  res.json(allNominees)
  // Mongoose documentation, at the bottom of getting started page. 
  // https://mongoosejs.com/docs/index.html
  // https://mongoosejs.com/docs/queries.html
})

app.get('/nominees/:name', async (request, response) => {
  const { name } = request.params;
  console.log(name)

  // {name: name} First 'name' is in the DB. Second is the search variable param thing. (line 103)
  // const singleNominee = await Nominee.find({name: name})
  // findOne finds THE FIRST object. 
  // const singleNominee = await Nominee.findOne({name: name})
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

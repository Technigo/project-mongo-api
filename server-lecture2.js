import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import membersData from './data/technigo-staff.json'

// This is what you put in the "new connection" page in MongoDB: mongodb://localhost/project-mongo
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// The model of the things in the database
const Member = new mongoose.model('Member', {
  name: String,
  surname: String,
  role: String,
  lettersInName: Number,
  isPapa: Boolean
});

if (process.env.RESET_DATABASE) {
  // This clears the database.
  const populateDatabase = async () => {
    await Member.deleteMany();
  
    // This re-populates the database.
    membersData.forEach(item => {
      const newMember = new Member(item);
      newMember.save();
    })
  }
  populateDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/members', async (req, res) => {
  // Went through this 11:00 (~30 minutes into the lecture)
  // Universalising this so that you can query "name='Matilda'" or "isPapa: true"
  const allMembers = await Member.find(req.query);
  res.json(allMembers);
})

app.get('/members/:name', async (req, res) => {
  // await is an alternative to .then.catch etc. Something asyncronous.
  // 11:10, kolla Maks historik.
  const singleMember = await Member.findOne({ name: req.params.name });
  res.json(singleMember);

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

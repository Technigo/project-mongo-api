import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import membersData from './data/groData.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/gro-project"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Member = new mongoose.model('Member', {
  id: Number,
  name: String,
  email: String,
  password: String,
  food: {
    name: String,
    food_id: Number,
    rating: Number,
    timestamp: Date
  }
})


if(process.env.RESET_DATABASE){
  const populateDatabase = async () => {
    await Member.deleteMany();
  
    membersData.forEach(item => {
      const newMember = new Member(item);
      newMember.save();
    })
  }
  populateDatabase();
}

app.get('/members', async (req, res) => {
  const allMembers = await Member.find();
  res.json(allMembers);
});

app.get('/members/:name', async (req, res) => {
  const singleMember = await Member.find({ name: req.params.name });

  res.json(singleMember);
});



// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

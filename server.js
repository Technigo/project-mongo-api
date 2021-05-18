import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import mlpCharacters from './data/my-little-ponies.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Character = mongoose.model('Character', {
  name: String,
  kind: String,
  age: String,
  residence: String,
  cutieMark: String,
  coatColor: String,
  eyeColor: String,
  maneColor: String,
  skills: String,
  maneSix: Boolean
});

const newCharacter = new Character({
  name: "Big McIntosh",
  kind: "Earth Pony",
  age: "Adult Pony",
  residence: "Ponyville",
  cutieMark: "Half a green apple",
  coatColor: "Red",
  eyeColor: "Green",
  maneColor: "Orange",
  skills: "Farming, Repairs, Singing, Strength, and saying Yup",
  maneSix: false
});
newCharacter.save();

const seedDB = () => {
  mlpCharacters.forEach(item => {
    const newCharacter = new Character(item);
    newCharacter.save();
  });
}

seedDB();

const port = process.env.PORT || 8000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/my-little-pony'

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('hello ponies')
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running 🦄 on http://localhost:${port}`)
})

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import mlpCharacters from './data/my-little-ponies.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const characterSchema = new mongoose.Schema({
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

const Character = mongoose.model('Character', characterSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Character.deleteMany();

    await mlpCharacters.forEach(item => {
      const newCharacter = new Character(item);
      newCharacter.save();
    });
  }  
  seedDB();
}

const port = process.env.PORT || 8000
const app = express()

//middlewares
app.use(cors())
app.use(express.json())

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/my-little-pony'

// Routes
app.get('/', (req, res) => {
  res.send('Hello Ponies!🦄')
});

app.get('/characters', async (req, res) => {
  const { name } = req.query;

  if (name) {
    const characters = await Character.find({
      name: {
        $regex: new RegExp(name, "i") //this operator tells mongo to not care about case sensitivity when searching
      }
    });
    res.json(characters);
  }
});

app.get('/characters/:characterId', async (req, res) => {
  const { characterId } = req.params;
  const singleCharacter = await Character.find({ _id: characterId });
  res.json(singleCharacter);
});

app.get('/characters/name/:characterName', async (req, res) => {
  const { characterName } = req.params;

  try {
    const singleCharacter = await Character.findOne({ name: characterName });
    res.json(singleCharacter);
  } catch(error) {
    res.status(400).json({ error: 'Sorry everypony looks like something went wrong!', details: error })
    }
});



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running 🦄 on http://localhost:${port}`)
});

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import mlpCharacters from './data/my-little-ponies.json';
import kinds from './data/my-little-ponies-kind.json';

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const characterSchema = new mongoose.Schema({
  name: String,
  kind: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kind'
  },
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

const kindSchema = new mongoose.Schema({
  description: String
});

const Kind = mongoose.model('Kind', kindSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Character.deleteMany();
    await Kind.deleteMany();

    const kindsArray = [];

    kinds.forEach(async item => {
      const kind = new Kind(item);
      kindsArray.push(kind);
      await kind.save();
    })

    mlpCharacters.forEach(async item => {
      const newCharacter = new Character({
        ...item,
        kind: kindsArray.find(singleKind => singleKind.description === item.kind)
      });
      await newCharacter.save();
    });
  }  
  seedDB();
}

const port = process.env.PORT || 8000
const app = express()

//middlewares
app.use(cors())
app.use(express.json())

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/myLittlePonyDatabase'

// Routes
app.get('/', (req, res) => {
  res.send('Hello EveryPony!🦄')
});


//Route to all character Data
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

//Route to charactersID path
app.get('/characters/:characterId', async (req, res) => {
  const { characterId } = req.params;

  try {
    const singleCharacter = await Character.find({ _id: characterId });
    res.json(singleCharacter);
  } catch (error) {
    res.status(404).json({ error: '404 Discord has worked his chaos magic it seems!', details: error })
  }
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

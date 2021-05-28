import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';

import mlpCharacters from './data/my-little-ponies.json';
import kinds from './data/my-little-ponies-kind.json';
import residences from './data/my-little-ponies-residence.json';

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/myLittlePonyDatabase"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const characterSchema = new mongoose.Schema({
  name: String,
  kind: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kind'
  },
  age: String,
  residence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Residence'
  },
  cutieMark: String,
  coatColor: String,
  eyeColor: String,
  maneColor: String,
  skills: String,
  maneSix: Boolean
});

const Character = mongoose.model('Character', characterSchema);

//Schema for types of pony Collection
const kindSchema = new mongoose.Schema({
  description: String
});

const Kind = mongoose.model('Kind', kindSchema)

//Schema for Residences collection (not working at moment)
const residenceSchema = new mongoose.Schema({
  place: String
});

const Residence = mongoose.model('Residence', residenceSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Character.deleteMany();
    await Kind.deleteMany();
    await Residence.deleteMany();

    const kindsArray = [];  
    const residencesArray = [];

    kinds.forEach(async item => {
      const kind = new Kind(item);
      kindsArray.push(kind);
      await kind.save();
    });   

    residences.forEach(async item => {
      const residence = new Residence(item);
      residencesArray.push(residence);
      await residence.save();
    });

    mlpCharacters.forEach(async (item) => {
      const newCharacter = new Character({
        ...item,
        kind: kindsArray.find(singleKind => singleKind.description === item.kind),
        residence: residencesArray.find(singleResidence => singleResidence.place === item.residence)
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


// Routes
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
});


//Route to all character Data
app.get('/characters', async (req, res) => {
  const { name, kind, residence } = req.query; 
  // const characters = await Character.aggregate([
  //   {
  //     $lookup: {
  //       from: "kinds",
  //       localField: "kind",
  //       foreignField: "description",
  //       as: "kinds"
  //     }
  //   },
  //   {
  //     $match: {
  //       name: {
  //         $regex: new RegExp(name || "", "i") //this operator tells mongo to not care about case sensitivity when searching
  //       },
  //       kind: {
  //         $regex: new RegExp(kind || "", "i") 
  //       }
  //     }
  //   }
  // ])

  if (name) {
    const characters = await Character.find({
      name: {
        $regex: new RegExp(name, "i") //this operator tells mongo to not care about case sensitivity when searching
      }
    }).populate('kind').populate('residence');
    res.json(characters);
   
  } else if (kind){
    const characters = await Character.find({
      kind: {
        $regex: new RegExp(kind, "i") 
      }
    }).populate('kind').populate('residence');
    res.json(characters);
  } else if (residence){
    const characters = await Character.find({
      residence: {
        $regex: new RegExp(residence, "i") 
      }
    }).populate('residence').populate('kind');
    res.json(characters);
  } else {
    const characters = await Character.find().populate('kind').populate('residence');
    res.json(characters);
  }
});

//Route to charactersID path
app.get('/characters/:characterId', async (req, res) => {
  const { characterId } = req.params;

  try {
    const singleCharacter = await Character.find({ _id: characterId }).populate('kind').populate('residence');

      if (singleCharacter) {
        res.json(singleCharacter)
        } else {
    res.status(404).json({ error: '404 Discord has worked his chaos magic and suddenly this page can not be found!' })
    res.status(404).json('')
        }
        } catch (error) {
        res.status(400).json({ error: 'Invalid request'})
        }
      res.json(singleCharacter);
    });

app.get('/name/:characterName', async (req, res) => {
//wanted to see the difference between a name query and a route/endpoint
  const { characterName } = req.params;

  try {
    const singleCharacter = await Character.findOne({ 
      name: {
        $regex: new RegExp(characterName, "i") 
      } 
    }).populate('kind').populate('residence');
    res.json(singleCharacter);
  } catch(error) {
    res.status(400).json({ error: '400 Sorry everypony looks like something went wrong!', details: error })
    }
});
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running 🦄 on http://localhost:${port}`)
});

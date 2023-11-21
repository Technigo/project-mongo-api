import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/birds';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const BirdFamily = mongoose.model('BirdFamily', {
  name: String,
  habitat: String,
  diet: String,
  averageLifespan: Number,
});

const Bird = mongoose.model('Bird', {
  name: String,
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BirdFamily',
  },
  habitat: String,
  diet: String,
  averageLifespan: Number,
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');
  const seedDatabase = async () => {
    await BirdFamily.deleteMany();
    await Bird.deleteMany();

    //collection of birds in bird families 
    const parrots = new BirdFamily({
      name: 'Parrots',
      habitat: 'Various',
      diet: 'Seeds and Fruits',
      averageLifespan: 30,
    });
    await parrots.save();

    const eagles = new BirdFamily({
      name: 'Eagles',
      habitat: 'Mountainous',
      diet: 'Fish and Small Mammals',
      averageLifespan: 25,
    });
    await eagles.save();

    await new Bird({
      name: 'African Grey Parrot',
      family: parrots,
      habitat: 'Rainforest',
      diet: 'Seeds',
      averageLifespan: 40,
    }).save();

    await new Bird({
      name: 'Amazon Parrot',
      family: parrots,
      habitat: 'Jungle',
      diet: 'Fruits',
      averageLifespan: 50,
    }).save();

    await new Bird({
      name: 'Bald Eagle',
      family: eagles,
      habitat: 'Mountainous regions',
      diet: 'Fish',
      averageLifespan: 20,
    }).save();

    await new Bird({
      name: 'Golden Eagle',
      family: eagles,
      habitat: 'Mountainous regions',
      diet: 'Small mammals',
      averageLifespan: 25,
    }).save();

  };

  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// New endpoint to list all endpoints
app.get('/', (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});
//gets all the families
app.get('/families', async (req, res) => {
  const families = await BirdFamily.find();
  res.json(families);
});

//gets the families and then a single bird by id 
app.get('/families/:id', async (req, res) => {
  const family = await BirdFamily.findById(req.params.id);
  if (family) {
    res.json(family);
  } else {
    res.status(404).json({ error: 'Bird family not found' });
  }
});

//get the birds based ont their habitat
app.get('/habitat/:habitat', async (req, res) => {
  try {
    const birds = await Bird.find({ habitat: req.params.habitat }).populate('family');
    res.json(birds);
  } catch (error) {
    console.error('Error fetching birds by habitat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get the birds based ont their diet
app.get('/diet/:diet', async (req, res) => {
  try {
    const birds = await Bird.find({ diet: req.params.diet }).populate('family');
    res.json(birds);
  } catch (error) {
    console.error('Error fetching birds by habitat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get all the birds
app.get('/birds', async (req, res) => {
  const birds = await Bird.find().populate('family');
  res.json(birds);
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

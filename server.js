import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import animals from "./data/zoo-animals.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Animal = mongoose.model('Animal', {
  name: String,
  animal_type: String,
  geo_range: String
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Animal.deleteMany();
    animals.forEach( singleAnimal => {
      const newAnimal = new Animal(singleAnimal);
      newAnimal.save();
    });
  }
  seedDatabase();
}

app.get("/", (req, res) => {
  res.send(
    {
      "Welcome": "to the Random Animal API",
      "Routes": {
        "/animals": "Show all animals",
        "/animals/animaltype/${animal_type}": "Shows all of the animals of a type, for example Bird, Mammal or Fish",
        "/animals/animalgeo/${geo_range}": "Shows all of the animals living in for example Africa",
        "/animals/animalname/${name}": "Shows one animal with that specific name",
      },
      "Queries": {
        "/animals/typeandgeo?animal_type=${animal_type}&geo_range=${geo_range}": "Show all animals of a certain type that lives in for example Africa. (/typeandgeo?animal_type=Mammal&geo_range=Africa)",
      },
    }
  );
});

app.get('/animals', async (req, res) => {
  const animals = await Animal.find();
  res.json(animals);
});

app.get('/animals/animaltype/:animal_type', async (req,res) => {
  const allAnimalsOfType = await Animal.find({ animal_type: req.params.animal_type }); 
  res.send(allAnimalsOfType);
});

app.get('/animals/animalgeo/:geo_range', async (req,res) => {
  const allAnimalsInGeo = await Animal.find({ geo_range: req.params.geo_range }); 
  res.send(allAnimalsInGeo);
});

app.get('/animals/animalname/:name', async (req,res) => {
  const animalWithName = await Animal.findOne({ name: req.params.name }); 

  if (animalWithName) {
    res.status(200).json({
      success: true,
      status_code: 200,
      data: animalWithName,
    })
  } else {
    res.status(404).json({
      success: false,
      status_code: 404,
      data: 'There is no animal with that name'
    })
  }
});

app.get('/animals/typeandgeo', async (req,res) => {
  const {animal_type, geo_range} = req.query;
  const typeandgeo = await Animal.find({ animal_type: animal_type, geo_range: geo_range }); 
  res.send(typeandgeo);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

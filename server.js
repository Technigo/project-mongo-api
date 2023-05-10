import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/animals";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Animal = mongoose.model('Animal', {
name: String,
age: Number,
isFurry: Boolean
})


const createAnimals = async () => {
  await Animal.deleteMany({}); // Clear the collection before creating new animals
  await new Animal({ name: 'Alfons', age: 2, isFurry:true }).save();
  await new Animal({ name: 'Lucy', age: 5, isFurry:true }).save();
  await new Animal({ name: 'Goldy', age: 1, isFurry:false }).save();
};

createAnimals();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use ((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
 
  } else {
    res.status(503).json ({ error: 'Service unavailable'})
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
Animal.find().then(animals => {
  res.json(animals)
})
});

app.get('/:name', async (req, res) => {
  try {
    const animal = await Animal.findOne({ name: req.params.name });
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (err) {
    res.status(404).json({ error: 'Invalid name' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

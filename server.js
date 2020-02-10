import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/asana" //API
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUndefinedTopology: true })
mongoose.Promise = Promise

const Chakra = mongoose.model('Chakra', {
  name: String,
  sanskritname: String,
  number: Number,
  color: String
})

const Asana = mongoose.model('Asana', {
  name: String,
  advanced: Boolean,
  chakra: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Chakra'
 } 
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!') //Use this command in terminal RESET_DATABASE=true npm run dev

const seedDatabase = async () => {
  await Chakra.deleteMany()  //makes the name not multiply when running the page multiple times
  await Asana.deleteMany()


  const rootchakra = new Chakra({ name: 'rootchakra', number: 1, color: 'red'  })
  await rootchakra.save()

  const sacralchakra = new Chakra({ name: 'sacralchakra', number: 2, color: 'orange'  })
  await sacralchakra.save()

  const solarplexuschakra = new Chakra({ name: 'solarplexuschakra', number: 3, color: 'yellow'  })
  await solarplexuschakra.save()

  const heartchakra = new Chakra({ name: 'heartchakra', number: 3, color: 'green'  })
  await heartchakra.save()

  const throatchakra = new Chakra({ name: 'throatchakra', number: 4, color: 'lightblue'  })
  await throatchakra.save()

  const thirdeyechakra = new Chakra({ name: 'thirdeyechakra', number: 5, color: 'darkblue'  })
  await thirdeyechakra.save()

  const crownchakra = new Chakra({ name: 'crownchakra', number: 6, color: 'purple'  })
  await crownchakra.save()

  //Rootchakra

  await new Asana({ title: "Standing mountain pose", name: "Standing mountain pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Table pose", name: "Table pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Downward facing dog pose", name: "Downward facing dog pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Akward chair pose", name: "Akward chair pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "High lunge pose", name: "High lunge pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Tree pose", name: "Tree pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Cobra pose", name: "Cobra pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ title: "Bridge pose", name: "Bridge pose", chakra: rootchakra, advanced: false }).save()

  //Sacralchakra

  await new Asana({ title: "Knee circles", name: "Knee circles", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Butterfly pose", name: "Butterfly pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Open-leg forward pose", name: "Open-leg forward pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Happy baby pose", name: "Happy baby pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Eye of the needle pose", name: "Eye of the needle pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Deep Lounge", name: "Deep Lounge", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Pigeon pose", name: "Pigeon pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Savasana with open legs", name: "Savasana with open legs", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Fire log pose", name: "Fire log pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ title: "Standing forward fold", name: "Standing forward fold", chakra: sacralchakra, advanced: false }).save()
        
  //Solarplexuschakra

  await new Asana({ title: "Warrior pose 1", name: "Warrior pose 1", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Warrior pose 2", name: "Warrior pose 2", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Warrior pose 3", name: "Warrior pose 3", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Triangle pose", name: "Triangle pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Reverse warrior pose", name: "Reverse warrior pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Seated twist", name: "Seated twist", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Standing half moon pose", name: "Standing half moon pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Boat pose", name: "Boat pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Extended side angle pose", name: "Extended side angle pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ title: "Plank pose", name: "Plank pose", chakra: solarplexuschakra, advanced: false }).save()

    //Heartchakra

    await new Asana({ title: "Thread the needle twist", name: "Thread the needle twist", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Cobra pose", name: "Cobra pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Camel pose", name: "Camel pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Fish pose", name: "Fish pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Wheel pose", name: "Wheel pose", chakra: heartchakra, advanced: true }).save()
    await new Asana({ title: "Half circle pose", name: "Half circle pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Crocodile pose", name: "Crocodile pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Extended puppy pose", name: "Extended puppy pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Handstand", name: "Handstand", chakra: heartchakra, advanced: true }).save()
    await new Asana({ title: "Cat/Cow", name: "Cat/Cow", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Restorative Savasana", name: "Restorative Savasana", chakra: heartchakra, advanced: false }).save()

    //Throatchakra

    await new Asana({ title: "Plow pose", name: "Plow pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Neck streches", name: "Neck streches", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Lateral shoulder streches", name: "Lateral shoulder streche", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Crow pose", name: "Crow pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Shoulder stand", name: "Shoulder stand", chakra: heartchakra, advanced: true }).save()
    await new Asana({ title: "Rabbit pose", name: "Rabbit pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Shoulder shrugs", name: "Shoulder shrugs", chakra: heartchakra, advanced: false }).save()
    await new Asana({ title: "Seated yoga mudra", name: "Seated yoga mudra", chakra: heartchakra, advanced: false }).save()
}
seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/chakra', async (req, res) => {
  const chakra = await Chakra.find()
  res.json(chakra)
})

app.get('/chakra/:id', async (req, res) => {
  const chakraId = await Chakra.findById(req.params.id)
  if (chakraId) {
    res.json(chakraId)
  } else {
    res.status(404).json({ error: 'chakra not found' })
  }
})

//filters on asanas(yogaposes) by chakra

app.get('/chakra/:id/asana', async (req, res) => {
  const chakra = await Chakra.findById(req.params.id)
  if (chakra) {
    const asana = await Asana.find({ chakra: mongoose.Types.ObjectId(chakra.id) })
    res.json(asana)
  } else {
    res.status(404).json({ error: 'cannot find id' })
  }
})

app.get('/asana', async (req, res) => {
  const asana = await Asana.find().populate('chakra') //.populate() adds the chakra info to the asana object
  if (asana) {
    res.json(asana)
  } else {
    res.status(404).json({ error: 'asana not found' })
  }
})

//This is not working

app.get('/asana', (req, res) => {
  const queryString = req.query.q; 
  const queryRegex = new RegExp(queryString, "i"); //queryString is how to search a string, "i" is ignoring the upper/lowercase
  Asana.find({'title': queryRegex})
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results);
      res.json(results);
    }).catch((err) => {
      // Error/Failure
      console.log('Error ' + err);
      res.json({message: 'Cannot find this asana', err: err});
    });
});

app.get('/asana/:id', async (req, res) => {
  const asanaId = await Asana.findById(req.params.id)
  if (asanaId) {
    res.json(asanaId)
  } else {
    res.status(404).json({ error: 'cannot find id' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

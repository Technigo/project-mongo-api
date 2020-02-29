import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'

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

const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
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

  await new Asana({ name: "Standing mountain pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Table pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Downward facing dog pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Akward chair pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "High lunge pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Tree pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Cobra pose", chakra: rootchakra, advanced: false }).save()
  await new Asana({ name: "Bridge pose", chakra: rootchakra, advanced: false }).save()

  //Sacralchakra

  await new Asana({ name: "Knee circles", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Butterfly pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Open-leg forward pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Happy baby pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Eye of the needle pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Deep Lounge", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Pigeon pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Savasana with open legs", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Fire log pose", chakra: sacralchakra, advanced: false }).save()
  await new Asana({ name: "Standing forward fold", chakra: sacralchakra, advanced: false }).save()
        
  //Solarplexuschakra

  await new Asana({ name: "Warrior pose 1", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Warrior pose 2", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Warrior pose 3", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Triangle pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Reverse warrior pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Seated twist", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Standing half moon pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Boat pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Extended side angle pose", chakra: solarplexuschakra, advanced: false }).save()
  await new Asana({ name: "Plank pose", chakra: solarplexuschakra, advanced: false }).save()

    //Heartchakra

    await new Asana({ name: "Thread the needle twist", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Cobra pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Camel pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Fish pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Wheel pose", chakra: heartchakra, advanced: true }).save()
    await new Asana({ name: "Half circle pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Crocodile pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Extended puppy pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Handstand", chakra: heartchakra, advanced: true }).save()
    await new Asana({ name: "Cat/Cow", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Restorative Savasana", chakra: heartchakra, advanced: false }).save()

    //Throatchakra

    await new Asana({ name: "Plow pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Neck streches", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Lateral shoulder streche", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Crow pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Shoulder stand", chakra: heartchakra, advanced: true }).save()
    await new Asana({ name: "Rabbit pose", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Shoulder shrugs", chakra: heartchakra, advanced: false }).save()
    await new Asana({ name: "Seated yoga mudra", chakra: heartchakra, advanced: false }).save()
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

//catches if there are any dabase errors, if not continue to queries

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) //If mongoose returns 1 = connected, go to route
    next()
  else { //if mongoose dont return 1, go to error message
    res.status(503).json({ error: 'Service unavaileble' })
  }  
})

const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      accessToken: req.header('Authorization')
    })
    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).json({ loggedOut: true })
    }
  } catch (err) {
    res
      .status(403)
      .json({ message: 'access token missing or wrong', errors: err.errors })
  }
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.post('/users', async (req, res) => {
  try {
    const { name, password } = req.body
    const user = new User({ name, password: bcrypt.hashSync(password) })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'could not save user', errors: err.errors })
  }
})

app.post('/sessions', async (req, res) => {
  try {
    const { name, password } = req.body
    const user = await User.findOne({ name })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ useId: user._id, accessToken: user.accessToken })
    } else {
      res.json({ notFound: true })
    }
  } catch (err) {
    res.status(400).json({ message: 'could not find user', errors: err.errors })
  }
})

app.get('/chakra', authenticateUser)
app.get('/chakra', async (req, res) => {
  try {  
    const chakra = await Chakra.find()
    if (chakra) { 
      res.json(chakra)
    } else { 
      res.status(404).json({ error: 'category not found' })
    }  
  } catch (err) {
    res.status(400).json({ error: 'Invalid' })
  }
  })

//fungerar!

app.get('/chakra/:id', async (req, res) => {
  try {
    const chakraId = await Chakra.findById(req.params.id)
    if (chakraId) {
      res.json(chakraId)
    } else {
      res.status(404).json({ error: ' not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid ' })
  }
})

//filters on asanas(yogaposes) by chakra

app.get('/chakra/:id/asana', async (req, res) => {
  try {
    const chakra = await Chakra.findById(req.params.id)
    if (chakra) {
      const asana = await Asana.find({ chakra: mongoose.Types.ObjectId(chakra.id) })
      res.json(asana)
    } else {
      res.status(404).json({ error: 'cannot find id' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid ' })
  }
})

/*app.get('/asana', async (req, res) => {
  const asana = await Asana.find().populate('chakra') //.populate() adds the chakra info to the asana object
  if (asana) {
    res.json(asana)
  } else {
    res.status(404).json({ error: 'asana not found' })
  }
})*/

//This is not working. Gör en try innan rad 182! Ändra till trycatch efter Damiens video

app.get('/asana', (req, res) => {
  const queryString = req.query.q; //search query like this http://localhost:8080/asana?q=wheel
  const queryRegex = new RegExp(queryString, "i"); //queryString is how to search a string, "i" is ignoring the upper/lowercase. 
  Asana.find({'name': queryRegex})
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results);
      res.json(results);
    }).catch((err) => {
      // Error/Failure

      //fungerar inte
      console.log('Error ' + err);
      res.json({message: 'Cannot find this asana', err: err});
    });
});

app.get('/asana/:id', async (req, res) => {
  try {
    const asanaId = await Asana.findById(req.params.id)
    if (asanaId) {
      res.json(asanaId)
    } else {
      res.status(404).json({ error: 'cannot find id' })
    }
    } catch (err) {
    res.status(400).json({ error: 'Invalid ' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

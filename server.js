import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'

import cloudinary from 'cloudinary'
import multer from 'multer'
import cloudinaryStorage from 'multer-storage-cloudinary'

import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: 'dlhmccbpm', // this needs to be whatever you get from cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}) //Handles API keys and secrets fron cloudinary

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'pets',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
}) //storage

process.env.CLOUDINARY_API_KEY

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/yoga" //API
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
  sanskritname: String,
  description: String,
  repeat: Boolean,
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
  email: {
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

  await new Asana({ name: "Childs pose", sanskritname: "Balasana", chakra: rootchakra, repeat: false }).save()//!
  await new Asana({ name: "Downward facing dog pose", sanskritname: "Adho Muhka Svanasana", chakra: rootchakra, repeat: false }).save()//!
  await new Asana({ name: "Akward chair pose", sanskritname: "Utkatasana", chakra: rootchakra, repeat: false }).save()//!
  await new Asana({ name: "High lunge pose", sanskritname: "Utthita Ashwa Sanchalanasana", chakra: rootchakra, repeat: true }).save()//!
  await new Asana({ name: "Tree pose", sanskritname: "Vrksasana", chakra: rootchakra, repeat: false }).save()//!
  await new Asana({ name: "Bridge pose", sanskritname: "Setu Bandha Sarvangasana", chakra: rootchakra, repeat: false }).save()//!

  //Sacralchakra

  await new Asana({ name: "Butterfly pose", sanskritname: "Supta Baddha Konasana", chakra: sacralchakra, repeat: false }).save()//!
  await new Asana({ name: "Open-leg forward pose", sanskritname: "Upavistha Konasana", chakra: sacralchakra, repeat: false }).save()//!
  await new Asana({ name: "Lizard pose", sanskritname: "Uttan Pristhasana", chakra: sacralchakra, repeat: true }).save()//!
  await new Asana({ name: "Deep Lounge", sanskritname: "Anjaneyasana", chakra: sacralchakra, repeat: true }).save()//!
  await new Asana({ name: "Pigeon pose", sanskritname: "Eka Pada Kapotasana", chakra: sacralchakra, repeat: true }).save()//!
  await new Asana({ name: "Fire log pose", sanskritname: "Agnistambhasana", chakra: sacralchakra, repeat: false }).save()//!
  await new Asana({ name: "Standing forward fold", sanskritname: "Uttanasana", chakra: sacralchakra, repeat: false }).save() //!
        
  //Solarplexuschakra

  await new Asana({ name: "Warrior pose 1", sanskritname: "Virabhadrasana 1", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Warrior pose 2", sanskritname: "Virabhadrasana 2", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Warrior pose 3", sanskritname: "Virabhadrasana 3", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Triangle pose", sanskritname: "Trikonasana", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Reverse warrior pose", sanskritname: "Viparita Virabhadrasana", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Seated twist", sanskritname: "Ardha Matsyendrasana", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Standing half moon pose", sanskritname: "Ardha Chandrasana", chakra: solarplexuschakra, repeat: true }).save()//!
  await new Asana({ name: "Boat pose", sanskritname: "Paripurna Navasana", chakra: solarplexuschakra, repeat: false }).save()//!
  await new Asana({ name: "Bow pulling pose", sanskritname: "Dhanurasana", chakra: solarplexuschakra, repeat: false }).save()//!
  await new Asana({ name: "Plank pose", sanskritname: "Phalakasana", chakra: solarplexuschakra, repeat: false }).save()//!

    //Heartchakra

    
    await new Asana({ name: "Camel pose", sanskritname: "Utrasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Fish pose", sanskritname: "Maysyasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Wheel pose", sanskritname: "Urdvha Dhanurasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Half circle pose", sanskritname: "Ardha Mandalasana", chakra: heartchakra, repeat: true }).save()//!
    await new Asana({ name: "Extended puppy pose", sanskritname: "Anahatasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Handstand", sanskritname: "Ardho Mukha Vrksasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Wild thing", sanskritname: "Camatkarasana", chakra: heartchakra, repeat: true }).save()//!
    await new Asana({ name: "Restorative Savasana", sanskritname: "Savasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Cobra pose", sanskritname: "Bhujangasana", chakra: rootchakra, repeat: false }).save()//!

    //Throatchakra

    await new Asana({ name: "Head circles", chakra: heartchakra, description: "Move your head in a circle", repeat: false }).save()//!
    await new Asana({ name: "Crane pose", sanskritname: "Kakasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Shoulder stand", sanskritname: "Salamba Sarvangasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Shoulder shrugs", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Seated yoga mudra", chakra: heartchakra, repeat: false }).save()//!

    //Thirdeyechakra

    await new Asana({ name: "Drawing the line", sanskritname: "Tadasana", chakra: heartchakra, repeat: false }).save()//!
    await new Asana({ name: "Eagle pose", sanskritname: "Garudasana", chakra: heartchakra, repeat: true }).save()//!
    await new Asana({ name: "Standing side opener pose", sanskritname: "Katichakrasana", chakra: heartchakra, repeat: true }).save()//!

    //Lotus pose
   
    await new Asana({ name: "Lotus pose", sanskritname: "Padmasana", chakra: rootchakra, repeat: false }).save()//!

    //Savasana

    await new Asana({ name: "Corpse pose", sanskritname: "Savasana", chakra: heartchakra, description: "Lay on your back and breathe slowly", repeat: false }).save()//!
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
    const { email, password } = req.body
    const user = new User({ email, password: bcrypt.hashSync(password) })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: 'could not save user', errors: err.errors })
  }
})

app.post('/sessions', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ userId: user._id, accessToken: user.accessToken })
    } else {
      res.json({ message: 'User not found' })
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

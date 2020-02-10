import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//depolyed at Heruku: https://annatereliusmongoapi.herokuapp.com/

// WAfV2IEidqVDmDR5 password mongo cloud
// mongodb+srv://annaholly:<password>@cluster0-trdcw.mongodb.net/test?retryWrites=true&w=majority connectionstring
// connectionstring Heruku/mongocloud : mongodb+srv://annaholly:WAfV2IEidqVDmDR5@cluster0-trdcw.mongodb.net/mongo_api?retryWrites=true&w=majority
//PMAK-5e3c53897371d60031f47163-12e3caaadf13341996d81dc084250d29d3 api-key for postman

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Nominee = mongoose.model('Nominee', {
  year_film: {
    type: Number
  },
  year_award: {
   type: Number
  },
  ceremony: {
    type: Number
  },
  category: {
   type: String
  },
  nominee: {
   type: String
  },
  
  film: {
    type: String
  },
  win: {
    type: Boolean
  }
});

//another way to wright mongoose model:
//const Nominee = mongoose.model('Nominee', {
  //year_film: Number,
  //year_award: Number,
  //ceremony: Number,
  //category: String,
  //nominee: String,
  //film: String,
  //win: Boolean
//})

const Year = mongoose.model('Year', {
  year: Number,
  zodiakYearAnimals : String,
  nominee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nominee'
  }
})

//RESET_DATABASE=true npm run dev

if (process.env.RESET_DATABASE) {
  //console.log('resetting database')

  const seedDatabase = async () => {
    await Nominee.deleteMany()
    await Year.deleteMany()
  
    const avatar = new Nominee({ year_film: 2009, year_award: 2010, ceremony: 67, category: "Best Motion Picture - Drama",  nominee:"Avatar", film: "", win: true })
    await avatar.save()
  
    const jonahHill = new Nominee({ year_film: 2011, year_award: 2012, ceremony: 69, category: "Best Performance by an Actor in a Supporting Role in any Motion Picture",  nominee:"Jonah Hill", film: "Moneyball", win: false })
    await jonahHill.save()
  
    const rebeccaFerguson = new Nominee({ year_film: 2013, year_award: 2014, ceremony: 71, category: "Best Performance by an Actress in a Limited Series or a Motion Picture Made for Television",  nominee:"Rebecca Ferguson", film: "The White Queen", win: false })
    await rebeccaFerguson.save()

    goldenGlobesData.forEach((nomineeData) => {
      new Nominee(nomineeData).save()
    })

    const y2009 =  new Year({ year: 2009, zodiakYearAnimals: 'Ox', nominee: avatar})
    await y2009.save()
    
    await new Year({ year: 2011, zodiakYearAnimals: 'Rabbit' }).save()
    await new Year({ year: 2013, zodiakYearAnimals: 'Snake' }).save()
  }
  
  seedDatabase()

}

//an other way to add new nominees
//Nominee.deleteMany().then(() => {
//new Nominee({ year_film: 2009, year_award: 2010, ceremony: 67, category: "Best Motion Picture - Drama",  nominee:"Avatar", film: "", win: true }).save()
//new Nominee({ year_film: 2011, year_award: 2012, ceremony: 69, category: "Best Performance by an Actor in a Supporting Role in any Motion Picture",  nominee:"Jonah Hill", film: "Moneyball", win: false }).save()
//new Nominee({ year_film: 2013, year_award: 2014, ceremony: 71, category: "Best Performance by an Actress in a Limited Series or a Motion Picture Made for Television",  nominee:"Rebecca Ferguson", film: "The White Queen", win: false }).save()
//})


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
  res.send('hello world')
})

//this shows all nominees
app.get('/nominees', async (req, res) => {
  const nominees = await Nominee.find()
    res.json(nominees)
})

//this shows all films selected year  
app.get('/year/:year', (req, res) => {
  Nominee.find({'year_film': req.params.year})
    .then((results) => {
    console.log("hej")
    res.json(results);
  }).catch((err) => {
    console.log("hej2")
    res.json({message: 'can not find year', err: err});
  });
})

//this shows avatar written in any way
app.get('/avatar', (req, res) => {
  Nominee.find({'nominee': /Avatar/i})
    .then((results) => {
    console.log("hej")
    res.json(results);
  }).catch((err) => {
    console.log("hej2")
    res.json({message: 'can not find nominee', err: err});
  });
})

//this shows any result wich includes searchstring (for exampel: nomineesQuery?q=swe, which returns the film: "One Chance" since it has the letters swe in the nominee)
app.get('/nomineesQuery', (req, res) => {
  const searchQuery = req.query.q
  const queryRegex = new RegExp(searchQuery, 'i')
  Nominee.find({'nominee': queryRegex})
    .then((results) => {
    console.log("queryRegex")
    if (Array.isArray(results) && results.length > 0){
      res.json(results)
    }else{
      res.status(404).json({error: 'nominee not found'})
    }
  }).catch((err) => {
    res.json({message: 'can not find nominee', err: err});
  });
})

//this shows one selected nominee
app.get('/:nominee', (req, res) => {
  Nominee.findOne({nominee: req.params.nominee}).then(nominee => {
    if (nominee){
      res.json(nominee)
    }else{
      res.status(404).json({error: 'not found, check your spelling'})
    }
  })
})

app.get('/years/:year', async (req, res) => {
  console.log('hej')
  const year = await Year.find({year: req.params.year}).populate('nominee')
  res.json(year)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

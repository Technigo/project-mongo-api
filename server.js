import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//const Nominee = mongoose.model('Nominee', {
  //year_film: Number,
  //year_award: Number,
  //ceremony: Number,
  //category: String,
  //nominee: String,
  //film: String,
  //win: Boolean
//})

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

//vans codealong
//const addNomineesToDatabase = () => {
  //goldenGlobesData.forEach((nominee) =>{
    //new Nominee(nominee).save();
  //});
//};

//addNomineesToDatabase();



const Year = mongoose.model('Year', {
  year_film: Number,
  nominee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nominee'
  }
})


//RESET_DATABASE=true npm start dev

//if (process.env.RESET_DATABASE) {
  //console.log('resetting database')

  //const seedDatabase = async () => {
    //await Nominee.deleteMany()
  
    //data.forEach((nomineeData) => {
			//new Nominee(nomineeData).save()
		//})
  //}
  
  //seedDatabase()
//}

//if (process.env.RESET_DATABASE) {
  //console.log('resetting database')

  const seedDatabase = async () => {
    await Nominee.deleteMany()
  
    const avatar = new Nominee({ year_film: 2009, year_award: 2010, ceremony: 67, category: "Best Motion Picture - Drama",  nominee:"Avatar", film: "", win: true })
    await avatar.save()
  
    const jonahHill = new Nominee({ year_film: 2011, year_award: 2012, ceremony: 69, category: "Best Performance by an Actor in a Supporting Role in any Motion Picture",  nominee:"Jonah Hill", film: "Moneyball", win: false })
    await jonahHill.save()
  
    const rebeccaFerguson = new Nominee({ year_film: 2013, year_award: 2014, ceremony: 71, category: "Best Performance by an Actress in a Limited Series or a Motion Picture Made for Television",  nominee:"Rebecca Ferguson", film: "The White Queen", win: false })
    await rebeccaFerguson.save()
  }
  
  seedDatabase()
//}



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


//app.get('/', (req, res) => {
  //Nominee.find().then(nominees => {
    //res.json(nominees)
  //})
//})

//app.get('/:nominee', (req, res) => {
  //Nominee.findOne({nominee: req.params.nominee}).then(nominee => {
    //if (nominee){
      //res.json(nominee)
    //}else{
      //res.status(404).json({error: 'not found'})
    //}
  //})
//})


app.get('/', (req, res) => {
  res.send('hello world')
})


app.get('/nominees', async (req, res) => {
  const nominees = await Nominee.find()
    res.json(nominees)
  })

  app.get('/years', async (req, res) => {
    const years = await Year.find().populate('nominee')
    res.json(nominees)
  })



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

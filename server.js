import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import showData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Shows = mongoose.model('Shows', {
  "show_id": Number,
  "title": String,
  "director": String,
  "cast": String,
  "country": String,
  "release_year": Number,
  "description": String,
  "type": String,
}, true)

app.get('/shows', (req, res) => {
  const page = +(req.query.page ?? 1);
  const pageSize = +(req.query.pageSize ?? 20);
   
  Shows.find().then(show => {    
    const startIndex = (page -1) * pageSize;
    const endIndex = startIndex + pageSize ;
    const shows = show.slice(startIndex, endIndex)
    const returnObject = { 
      pageSize: pageSize,
      page: page,
      maxPages: Math.ceil(showData.length/pageSize),
      totalShows: showData.length,
      results: shows
    }

    res.json(returnObject)
  })
})

app.get('/shows/:id', (req, res) => {
  
  Shows.findOne({ show_id: req.params.id }).then(show => {
    if (show) {
      res.json(show)
    } else {
      res.status(404).json({ error: `This show does not exist!`})
    }
  })
})

app.get('/categories', (req, res) => {
  
  Shows.find().then(show => {
    let categories = []

    show.forEach((item) => {
      if (!categories.includes(item.type)) {
        categories.push(item.type)
      }
      else return
    })

    res.json(categories)
  })
})

app.get('/categories/:category', (req, res) => {
  const category = req.params.category

  Shows.find( { type: category }).collation({ locale: 'en_US', strength: 1 }).then (category => {
    if (category.length === 0) (
      res.json(`There is no category named ${req.params.category}`)
    )
    res.json(category)
  })
})


// app.get('/:name', (req, res) => {
//   Animal.findOne({ name: req.params.name}).then(animal => {

//     if (animal) {
//       res.json(animal)
//     }
//     else {
//       res.status(404).json({ error: `No animals with the name ${req.path.substring(1)}` })
//     }
//   })
// })

app.use((req, res, next) => { // if server
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable"})
  }
})

app.use((req,res,next) => {
  res.status(404).json({error: `No path ${req.path}`})
})

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Shows.deleteMany({})

		showData.forEach((show) => {
			new Shows(show).save()
		})
  }

  seedDatabase()
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

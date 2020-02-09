import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'


/* {
    "show_id": 81193313,
        "title": "Chocolate",
            "director": "",
                "cast": "Ha Ji-won, Yoon Kye-sang, Jang Seung-jo, Kang Bu-ja, Lee Jae-ryong, Min Jin-woong, Kim Won-hae, Yoo Teo",
                    "country": "South Korea",
                        "date_added": "November 30, 2019",
                            "release_year": 2019,
                                "rating": "TV-14",
                                    "duration": "1 Season",
                                        "listed_in": "International TV Shows, Korean TV Shows, Romantic TV Shows",
                                            "description": "Brought together by meaningful meals in the past and present, a doctor and a chef are reacquainted when they begin working at a hospice ward.",
                                                "type": "TV Show"
}, */

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Show = mongoose.model('Show', {
    show_id: Number,
    title: String,
    director: String,
    cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: String,
    description: String,
    type: String



})

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

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
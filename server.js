import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows"
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


const seedDatabase = async() => {
    await Show.deleteMany()
    netflixData.forEach(show => {

        new Show(show).save()
    })
}

seedDatabase()

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


app.get('/shows', async(req, res) => {
    const shows = await Show.find()
    res.json(shows)
})

//Search the title with regex

app.get('/regex', (reg, res) => {
    const queryString = reg.query.q
    const queryRegex = new RegExp(queryString, 'i')
    Show.find({ 'title': queryRegex })
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            res.json({ message: 'Cant find this query' })
        })
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
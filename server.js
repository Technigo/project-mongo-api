import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/netflix'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8085
const app = express()

const Title = mongoose.model('Title', {
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
	type: String,
})

if (process.env.RESET_DATABASE) {
	// const seedDatabase = async () => {
	// 	await Title.deleteMany()

	netflixData.forEach((singleTitle) => {
		new Title(singleTitle).save()
	})
	// }

	// seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
	res.send(listEndpoints(app))
})

app.get('/allShows', async (req, res) => {
	const allShows = await Title.find({})
	res.send(allShows)
})

//query string for title, country, director and cast
app.get('/shows', async (req, res) => {
	const { title, country, director, cast } = req.query

	try {
		const allTitles = await Title.find({
			title: new RegExp(title, 'i'),
			country: new RegExp(country, 'i'),
			director: new RegExp(director, 'i'),
			cast: new RegExp(cast, 'i'),
		})

		res.status(200).json(allTitles)
	} catch (error) {
		res.status(400).json({
			message: 'Not found, please try again',
			success: false,
		})
	}
})

// app.get('/shows/:id', async (req, res) => {
// 	const { id } = req.params

// 	const titleById = await Title.findOne({ show_id: +id })

// 	if (titleById) {
// 		res.status(200).json(titleById)
// 	} else {
// 		res.status(484).json({ error: 'No titles with that ID is found' })
// 	}
// })

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
